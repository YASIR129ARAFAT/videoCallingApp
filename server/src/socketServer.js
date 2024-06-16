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
io.on('connection', (socket) => {
    console.log("socket connected...");
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
                socketId: socket?.id,
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
    }

    socket.on('newOffer', ({ offer, apptInfo }) => {
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
            answerIceCandidates: [],
        }

        // console.log("allKnownOffers");
        // console.log(allKnownOffers);

        // we need to emit newOfferWaiting to the professional related to the offer
        const professional = connectedProfessionals.find((ele) => {
            return ele.fullname === apptInfo?.professionalsFullName
        });

        // make waiting for the this appt true
        const proffesionalsAppt = app.get("proffesionalsAppt");
        const appt = proffesionalsAppt.find((ele)=>{
            return ele.uniqueId === apptInfo?.uniqueId;
        })

        if(appt){
            appt.waiting = true; // this will mutate the original professionalsAppt as well
        }

        //find the socket id of that person to emoit
        if (professional) {
            //only emit if the petson is still connected
            const socketId = professional.socketId;
            socket.to(socketId).emit("newOfferWaiting", allKnownOffers[apptInfo?.uniqueId]);

            const data = app.get("proffesionalsAppt")
                        .filter((ele) => ele?.professionalsFullName === apptInfo?.professionalsFullName);
            socket.to(socketId).emit('apptData', data)

        }

    })
})