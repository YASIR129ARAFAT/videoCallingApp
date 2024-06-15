const { app } = require('./server.js')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require("uuid")


console.log("dcds");

app.get('/', (req, res) => {
    res.send("hello")
})



const proffesionalsAppt = [];
app.get('/user-link', async (req, res) => {
    try {
        const uniqueId = uuidv4();
        const apptData = {
            uniqueId, //uuid
            name: 'John Doe',
            apptDate: Date.now() + 800000,
            age: 23,
            gender: 'M',
            clientName: "Jim Jones"
        }

        proffesionalsAppt.push(apptData);

        const token = await jwt.sign(apptData, process.env.SOCKET_TOKEN_SECRET);

        res.send(token)
    } catch (error) {
        console.log(error);
        res.json(error);
    }
})

app.post('/verify-link', async (req, res) => {
    try {
        const { token } = req.body
        console.log("token");
        console.log(token);
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
            fullname: "nuclear man",
            proId: 1234
        }
        const token = await jwt.sign(userData, process.env.SOCKET_TOKEN_SECRET)

        res.send(`<a href='https://localhost:${process.env.FRONTEND_PORT}/dashboard?token=${token}' target='_blank'>click here</a>`)
    } catch (error) {
        console.log(error);
    }
})