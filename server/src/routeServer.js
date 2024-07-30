const { app } = require('./server.js')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require("uuid")
const { authMiddleware } = require('./middlewares/auth.middleware.js')
// console.log("dcds");

app.get('/', (req, res) => {
    res.send("hello")
})



const proffesionalsAppt = [{
    name: "Peter Chan, J.D.",
    apptDate: Date.now() + 500000,
    _id:'669a4fac1571b63cdb284f6b',
    clientName: "Jim Jones",
}, {
    name: "Peter Chan, J.D.",
    apptDate: Date.now() - 2000000,
    _id: 2,// uuid:uuidv4(),
    clientName: "Akash Patel",
}, {
    name: "Peter Chan, J.D.",
    apptDate: Date.now() + 10000000,
    _id: 3,//uuid:uuidv4(),
    clientName: "Mike Williams",
}];

app.set("proffesionalsAppt", proffesionalsAppt); // this will make the varible global that an be acessed using app.get("proffesionalsAppt")

// app.get('/user-link', async (req, res) => {
//     try {
//         // const _id = uuidv4();
//         // const apptData = {
//         //     _id, //uuid
//         //     name: 'John Doe',
//         //     apptDate: Date.now() + 800000,
//         //     clientName: "Jack Martha"
//         // }

//         const apptData = proffesionalsAppt[0];

//         // proffesionalsAppt.push(apptData);
//         // console.log("apptData: ",apptData);

//         const token = await jwt.sign(apptData, process.env.SOCKET_TOKEN_SECRET);
//         res.send(`<a href='${process.env.FRONTEND_URL}/join-video?token=${token}' target='_blank'>Meet here</a>`)

//     } catch (error) {
//         console.log(error);
//         res.json(error);
//     }
// })

app.post('/link2', authMiddleware,async (req, res) => {
    try {
        const {apptId} = req.body
        // const {_id} = req.user
        // console.log("aslkndsbdb",req.body);
        let apptData = await Appointment
                                .findById({_id:apptId})
                                .populate({
                                    path: "clientId",
                                    select: "name email image dob gender mobile userType",
                                })
                                .populate({
                                    path: "professionalId",
                                    select: "name email image dob gender mobile userType",
                                });

        apptData = apptData.toObject()
        
        

        // proffesionalsAppt.push(apptData);
        // console.log("apptData: ",apptData);

        const token = await jwt.sign(apptData, process.env.SOCKET_TOKEN_SECRET);
        res.json({success:1,token,apptData})

    } catch (error) {
        console.log(error);
        res.json(error);
    }
})

app.post('/verify-link', async (req, res) => {
    try {
        const { token } = req.body
        // console.log("token");
        // console.log(token);
        const user = jwt.verify(token, process.env.SOCKET_TOKEN_SECRET);

        res.json(user);
    } catch (error) {
        console.log(error);
    }
})

app.get('/pro-token2',authMiddleware, async (req, res) => {
    try {
        const userData = req.user?.toObject(); // jwt.sign need a plain javascript object
        // console.log("pro2:  ",userData);
        const token = await jwt.sign(userData, process.env.SOCKET_TOKEN_SECRET)

        res.json(token)
    } catch (error) {
        console.log(error);
    }
})

// app.get('/pro-token',authMiddleware, async (req, res) => {
//     try {
//         const userData = {
//             name: "Peter Chan, J.D.",
//             _id: 1234,
//         }
//         const token = await jwt.sign(userData, process.env.SOCKET_TOKEN_SECRET)

//         res.send(`<a href='${process.env.FRONTEND_URL}/dashboard?token=${token}' target='_blank'>DashBoard here</a>
//             `)
//     } catch (error) {
//         console.log(error);
//     }
// })

//---------------------





const { userRoute } = require('./routes/user.route.js')
const { authRoute } = require('./routes/auth.route.js');
const { appointmentRoute } = require('./routes/appointment.route.js')
const { Appointment } = require('./models/appointment.models.js')

app.use('/auth', authRoute);
app.use('/user',authMiddleware, userRoute);
app.use('/appointment',authMiddleware,appointmentRoute);