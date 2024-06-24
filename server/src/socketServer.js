const { io } = require('./server.js')
const jwt = require('jsonwebtoken')
const { app } = require('./server.js')

const allKnownOffers = { // this will be an object that will contain all appt as an obj with a unique id as key
    //unique id
    // offer
    //proffesional's name
    //client's name
    // apptDate
    //offerer ice candidates
    //answer
    //answerer ice candidates
}
const connectedProfessionals = []
const connectedClients = []
io.on('connection', (socket) => {
    // console.log("socket connected...");
    const token = socket.handshake.auth?.token

    let decodedData;
    // token is sent in auth at the time of calling for a asocket connection
    try {
        decodedData = jwt.verify(token, process.env.SOCKET_TOKEN_SECRET);
    } catch (error) {
        console.log("socket disconnected..");
        socket.disconnect()
        return
    }
    // console.log("decoded: ",decodedData);

    const { fullname, proId } = decodedData;


    if (proId) {
        //this is a professional because only professionals have the proId


        // if an alredy connected person tries to connect again dont add him again
        //give him a different socket id by updating its previous values in connectedProfessionals array
        const ind = connectedProfessionals.findIndex(ele => ele.proId === proId);
        if (ind != -1) {
            connectedProfessionals[ind].socketId = socket?.id
        }
        else {
            connectedProfessionals.push({
                socketId: socket?.id, //socketid of the professional
                fullname,
                proId
            })
        }

        //prepare all appt data related to this professional to emit
        // this data will be shown on frontend of this professional
        const data = app.get("proffesionalsAppt")
                        .filter((ele) => ele?.professionalsFullName === fullname);
                        
        socket.emit('apptData', data)

        

        //loop through all the offers and send those client's data (offer data) to the professional that just joined.
        for (const key in allKnownOffers) {
            const ele = allKnownOffers[key]
            if (ele?.professionalsFullName === fullname) {
                io.to(socket?.id).emit("newOfferWaiting", ele); // this will be emitted to this particular professional only
            }
        }

    }
    else {

        //this is a client
        const {professionalsFullName,uniqueId,apptDate,clientsName} = decodedData;
        const client =connectedClients.find(ele=>ele?.uniqueId == uniqueId); // string and NUmber comparison

        if(client){
            //if client reconnects then change the socket id only
            client.socketId = socket?.id
        }
        else{
            connectedClients.push({
                clientsName,
                uniqueId,
                professionalMeetingWith: professionalsFullName,
                socketId:socket.id, //socket id of the client
            })
        }

        // it might be possible that the client disconnects after sending the offer or clinet diconnected when professional sent answer
        // to deal with that we will save the answer in allKnownOffers
        // and whenever a client connects we will check if an answer already exits for him/her corresponding to the uniqueId client came with

        const answerForThisClient = allKnownOffers[uniqueId]
        if(answerForThisClient){
            //if answer wrt to this clients id exist then
            // emit to this client
            io.to(socket.id).emit("answerToClient",answerForThisClient.answer);
        }

    }

    socket.on("newAnswer",({answer,uniqueId})=>{
        // console.log(answer);
        // console.log("uniqueId",uniqueId);

        // emit this answer to the client who sent the offer
        const clientToConnectTo = connectedClients.find(ele=>ele.uniqueId == uniqueId)
        if(clientToConnectTo){
            socket.to(clientToConnectTo.socketId).emit("answerToClient",answer);
        }

        // we need to update the answer of this offer in allKnownOffers
        const knownOffer = allKnownOffers[uniqueId]

        if(knownOffer){
            knownOffer.answer = answer;
        }

        // it might be possible that the client disconnects after sending the offer or clinet diconnected when professional sent answer
        // to deal with that we will save the answer in allKnownOffers
        // and whenever a client connects we will check if an answer already exits for him/her corresponding to the uniqueId client came with

    })

    socket.on('newOffer', ({ offer, apptInfo }) => {
        // console.log("id: ",socket?.id);
        // offer -> sdp/type
        // apptInfo contains the details of appt along with a unique uuid
        // this will help in unique indentification of appt
        
        // console.log("apptInfo");
        // console.log(apptInfo);

        allKnownOffers[apptInfo?.uniqueId] = {
            ...apptInfo,
            offer,
            answer: null,
            offererIceCandidates: [],
            answererIceCandidates: [],
        }


        

        // make waiting for the this appt true
        const proffesionalsAppt = app.get("proffesionalsAppt");
        const appt = proffesionalsAppt.find((ele)=>{
            return ele.uniqueId === apptInfo?.uniqueId;
        })

        if(appt){
            appt.waiting = true; // this will mutate the original professionalsAppt as well
        }

        // we need to emit newOfferWaiting to the professional related to the offer
        const professional = connectedProfessionals.find((ele) => {
            return ele.fullname === apptInfo?.professionalsFullName
        });
        //find the socket id of that person to emit
        if (professional) {
            //only emit if the person is still connected
            const socketId = professional.socketId;
            socket.to(socketId).emit("newOfferWaiting", allKnownOffers[apptInfo?.uniqueId]);

            const data = app.get("proffesionalsAppt")
                        .filter((ele) => ele?.professionalsFullName === apptInfo?.professionalsFullName);
            socket.to(socketId).emit('apptData', data)

        }

    })

    socket.on('getIce',(uniqueId,userType,ackFunc)=>{
        let iceCandidates = [];
        const offer = allKnownOffers[uniqueId];
        if(offer){
            if(userType === "professional"){
                // console.log("proff");
                // console.log(offer.offererIceCandidates);
                iceCandidates  = offer.offererIceCandidates
            }
            else if(userType === 'client'){
                // console.log("client");
                // console.log(offer.answererIceCandidates);
                iceCandidates = offer.answererIceCandidates;
            }
            ackFunc(iceCandidates); // sending back the iceCandidates to frontEnd
        }
        // console.log("herer");
    })

    socket.on('iceToServer',({iceCandidate,userType,uniqueId})=>{
        //now update the allKnownOffer for corresponding offer using uniqueId
        const offerToAddIce = allKnownOffers[uniqueId];
        // console.log(offerToAddIce);
        if(offerToAddIce ){
            console.log("iceToServer");
            if(userType === "professional"){
                // console.log("pro");
                offerToAddIce.answererIceCandidates.push(iceCandidate)


                const socketToSendTo = connectedClients.find(ele=>{
                    return ele.uniqueId == uniqueId
                })

                if(socketToSendTo){
                    socket.to(socketToSendTo.socketId).emit("iceToClient",iceCandidate)
                }
            }
            else if(userType === "client"){
                // console.log("client");
                offerToAddIce.offererIceCandidates.push(iceCandidate)

                const socketToSendTo = connectedProfessionals.find(ele=>{
                    return ele.fullname === decodedData?.fullname
                })

                if(socketToSendTo){
                    socket.to(socketToSendTo.socketId).emit("iceToClient",iceCandidate)
                }
            }
        }
        // console.log("==========");
        // console.log(allKnownOffers[uniqueId].answererIceCandidates);
        // console.log("==========");
    })
})