const { app } = require('./server.js')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require("uuid")


console.log("dcds");

app.get('/', (req, res) => {
    res.send("hello")
})



const proffesionalsAppt = [{
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() + 500000,
    uniqueId: 1,
    clientName: "Jim Jones",
}, {
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() - 2000000,
    uniqueId: 2,// uuid:uuidv4(),
    clientName: "Akash Patel",
}, {
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() + 10000000,
    uniqueId: 3,//uuid:uuidv4(),
    clientName: "Mike Williams",
}];

app.set("proffesionalsAppt", proffesionalsAppt); // this will make the varible global that an be acessed using app.get("proffesionalsAppt")

app.get('/user-link', async (req, res) => {
    try {
        // const uniqueId = uuidv4();
        // const apptData = {
        //     uniqueId, //uuid
        //     professionalsFullName: 'John Doe',
        //     apptDate: Date.now() + 800000,
        //     clientName: "Jack Martha"
        // }

        const apptData = proffesionalsAppt[0];

        // proffesionalsAppt.push(apptData);

        const token = await jwt.sign(apptData, process.env.SOCKET_TOKEN_SECRET);
        res.send(`<a href='https://localhost:${process.env.FRONTEND_PORT}/join-video?token=${token}' target='_blank'>Meet here</a>`)

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

console.log("dcds");

app.get('/pro-token', async (req, res) => {
    try {
        const userData = {
            fullname: "Peter Chan, J.D.",
            proId: 1234,
        }
        const token = await jwt.sign(userData, process.env.SOCKET_TOKEN_SECRET)

        res.send(`<a href='https://localhost:${process.env.FRONTEND_PORT}/dashboard?token=${token}' target='_blank'>DashBoard here</a>
            `)
    } catch (error) {
        console.log(error);
    }
})