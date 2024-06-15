const { io } = require('./server.js')
const jwt = require('jsonwebtoken')
const allKnownOffers = {
    //unique id
    // offer
    //proffesionals name
    //client name
    // apptDate
    //offerer ice candidates
    //answer
    //answerer ice candidates
}
const connectedProfessionals = []
io.on('connection', (socket) => {
    console.log("socket connected...");
    const token = socket.handshake.auth.token

    let decodedData;
    // token is sent in auth at the time of calling for a asocket connection
    try {
        decodedData = jwt.verify(token, process.env.SOCKET_TOKEN_SECRET);
    } catch (error) {
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

        console.log(connectedProfessionals);
        console.log("=======");
    }
    else {
        //this is a client
    }

    socket.on('newOffer', ({ offer, apptInfo }) => {
        // offer -> sdp/type
        // apptInfo contains the details of appt along with a unique uuid
        // this will help in unique indentification of app


        allKnownOffers[apptInfo?.uniqueId] = {
            ...apptInfo,
            offer,
            answer: null,
            offererIceCandidates: [],
            answerIceCandidates: [],
        }
        // console.log("allknown");
        // console.log(allKnownOffers);
        // we need to emit this to the person who sent the new offer
        const person = connectedProfessionals.find((ele) => ele.fullname === apptInfo?.name);
        //find the socket id of that person to emoit
        if (person) {
            //only emit if the petson is till connected
            const socketId = person.socketId;
            socket.to(socketId).emit("newOfferWaiting", allKnownOffers[apptInfo?.uniqueId]);
        }

    })
})