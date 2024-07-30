const { io } = require("./server.js");
const jwt = require("jsonwebtoken");
const { app } = require("./server.js");
const { Appointment } = require("./models/appointment.models.js");

const allKnownOffers = {
  // this will be an object that will contain all appt as an obj with a unique id as key
  //unique id
  // offer
  //proffesional's name
  //client's name
  // apptDate
  //offerer ice candidates
  //answer
  //answerer ice candidates
};
const connectedProfessionals = [];
const connectedClients = [];
io.on("connection", async (socket) => {
  // console.log("socket connected...");
  const token = socket.handshake.auth?.token;

  let decodedData;
  // token is sent in auth at the time of calling for a asocket connection
  try {
    decodedData = jwt.verify(token, process.env.SOCKET_TOKEN_SECRET);
  } catch (error) {
    console.log("socket disconnected..", error);
    socket.disconnect();
    return;
  }
  // console.log("decoded: ",decodedData);

  const { name, _id, userType } = decodedData;

  if (userType === "professional") {
    //this is a professional because only professionals have the _id
    console.log(userType, "entered");

    // if an alredy connected person tries to connect again dont add him again
    //give him a different socket id by updating its previous values in connectedProfessionals array
    const ind = connectedProfessionals.findIndex((ele) => ele._id === _id);
    if (ind != -1) {
      connectedProfessionals[ind].socketId = socket?.id;
    } else {
      connectedProfessionals.push({
        socketId: socket?.id, //socketid of the professional
        name, // name of professional
        _id,
      });
    }

    //prepare all appt data related to this professional to emit
    // this data will be shown on frontend of this professional
    // const data = app.get("proffesionalsAppt")
    //                 .filter((ele) => ele?._id === _id);

    const data = await Appointment.find({ professionalId: _id })
      .populate({
        path: "clientId",
        select: "name email image dob gender mobile userType",
      })
      .populate({
        path: "professionalId",
        select: "name email image dob gender mobile userType",
      });

    socket.emit("apptData", data);

    //loop through all the offers and send those client's data (offer data) to the professional that just joined.
    for (const key in allKnownOffers) {
      const ele = allKnownOffers[key];
      if (ele?.professionalId?._id === _id) {
        io.to(socket?.id).emit("newOfferWaiting", ele); // this will be emitted to this particular professional only
      }
    }
  } else {
    console.log("client entered");

    //this is a client
    const { name, _id, clientId, professionalId } = decodedData;
    // console.log("decoded client::::",decodedData);
    const client = connectedClients.find((ele) => ele?._id == _id); // string and Number comparison

    if (client) {
      //if client reconnects then change the socket id only
      client.socketId = socket?.id;
    } else {
      // console.log("values entered",{name:clientId?.name,
      //     _id,
      //     professional: professionalId?.name,
      //     socketId:socket.id,});

      connectedClients.push({
        name: clientId?.name, //clients name
        _id, // id of appointments
        professional: professionalId?.name,
        socketId: socket.id, //socket id of the client
      });
    }

    // it might be possible that the client disconnects after sending the offer or client diconnected when professional sent answer
    // to deal with that we will save the answer in allKnownOffers
    // and whenever a client connects we will check if an answer already exits for him/her corresponding to the _id client came with

    const answerForThisClient = allKnownOffers[_id];
    if (answerForThisClient) {
      //if answer wrt to this clients id exist then
      // emit to this client
      io.to(socket.id).emit("answerToClient", answerForThisClient.answer);
    }
  }

  socket.on("newAnswer", ({ answer, _id }) => {
    // console.log("answer1");
    // console.log("_id",_id);

    // emit this answer to the client who sent the offer
    const clientToConnectTo = connectedClients.find((ele) => ele._id == _id);
    if (clientToConnectTo) {
        console.log("answerrr");
      socket.to(clientToConnectTo.socketId).emit("answerToClient", answer);
    }

    // we need to update the answer of this offer in allKnownOffers
    const knownOffer = allKnownOffers[_id];

    if (knownOffer) {
      knownOffer.answer = answer;
    }

    // it might be possible that the client disconnects after sending the offer or clinet diconnected when professional sent answer
    // to deal with that we will save the answer in allKnownOffers
    // and whenever a client connects we will check if an answer already exits for him/her corresponding to the _id client came with
  });

  socket.on("newOffer", async ({ offer, apptInfo }) => {
    // console.log("offer",offer);
    // offer -> sdp/type
    // apptInfo contains the details of appt along with a unique uuid
    // this will help in unique indentification of appt

    // console.log("apptInfo");
    // console.log(apptInfo);

    allKnownOffers[apptInfo?._id] = {
      ...apptInfo,
      offer,
      answer: null,
      offererIceCandidates: [],
      answererIceCandidates: [],
    };

    // make waiting for the this appt true
    let proffesionalsAppt = await Appointment.find({
      professionalId: apptInfo?.professionalId?._id,
    })
      .populate({
        path: "clientId",
        select: "name email image dob gender mobile userType",
      })
      .populate({
        path: "professionalId",
        select: "name email image dob gender mobile userType",
      });

    //   proffesionalsAppt = proffesionalsAppt.toObject()

    // console.log("proff",proffesionalsAppt);
    // console.log("info",apptInfo);
    let appt = proffesionalsAppt.find((ele) => {
      return (ele._id) == (apptInfo?._id);
    });

    if (appt) {
        appt = Object.assign({}, appt, { waiting: true }); // this will mutate the original professionalsAppt as well
        // console.log("found:::",appt);
    }
    // console.log("herereerer");
    // we need to emit newOfferWaiting to the professional related to the offer
    const professional = connectedProfessionals.find((ele) => {
      return ele._id == apptInfo?.professionalId?._id;
    });
    //find the socket id of that person to emit
    if (professional) {
        // console.log("all known: ",allKnownOffers[apptInfo?._id]);
      //only emit if the person is still connected
      const socketId = professional.socketId;
      socket
        .to(socketId)
        .emit("newOfferWaiting", allKnownOffers[apptInfo?._id]);

      let data = proffesionalsAppt.filter(
        (ele) => ele?.professionalId?._id == apptInfo?.professionalId?._id
      );
      
      data.map((ele,ind)=>{
        if(ele?._id == apptInfo?._id){
            ele = ele.toObject()
            ele = Object.assign({}, ele, { waiting: true });
            data[ind]=ele;

        }
      })

      
      socket.to(socketId).emit("apptData", data);
    //   console.log("data sent......",data);
    }
  });

  socket.on("getIce", (_id, userType, ackFunc) => {
    let iceCandidates = [];
    const offer = allKnownOffers[_id];
    if (offer) {
      if (userType === "professional") {
        // console.log("proff");
        // console.log(offer.offererIceCandidates);
        iceCandidates = offer.offererIceCandidates;
      } else if (userType === "client") {
        // console.log("client");
        // console.log(offer.answererIceCandidates);
        iceCandidates = offer.answererIceCandidates;
      }
      ackFunc(iceCandidates); // sending back the iceCandidates to frontEnd
    }
    // console.log("herer");
  });

  socket.on("iceToServer", ({ iceCandidate, userType, _id }) => {
    //now update the allKnownOffer for corresponding offer using _id
    const offerToAddIce = allKnownOffers[_id];
    // console.log(offerToAddIce);
    if (offerToAddIce) {
      console.log("iceToServer");
      if (userType === "professional") {
        console.log("pro");
        offerToAddIce.answererIceCandidates.push(iceCandidate);

        const socketToSendTo = connectedClients.find((ele) => {
          return ele._id == _id;
        });

        if (socketToSendTo) {
          socket.to(socketToSendTo.socketId).emit("iceToClient", iceCandidate);
        }
      } else if (userType === "client") {
        console.log("client");
        offerToAddIce.offererIceCandidates.push(iceCandidate);

        const socketToSendTo = connectedProfessionals.find((ele) => {
          return ele._id == decodedData?.professionalId?._id;
        });

        if (socketToSendTo) {
          socket.to(socketToSendTo.socketId).emit("iceToClient", iceCandidate);
        }
      }
    }
    // console.log("==========");
    // console.log(allKnownOffers[_id].answererIceCandidates);
    // console.log("==========");
  });
});
