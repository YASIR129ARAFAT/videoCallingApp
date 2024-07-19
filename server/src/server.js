const fs = require('fs')
const express = require('express')
const https = require('https')
const socketio = require('socket.io')
const app = express()
const cors = require("cors")
const dotenv = require('dotenv');
const { dbConnection } = require('./db/connection.db')

app.use(express.static('../public'))
app.use(cors());
app.use(express.json())

dotenv.config({
    path: '../.env'
})

dbConnection()

const key = fs.readFileSync('./certs/cert.key')
const cert = fs.readFileSync('./certs/cert.crt')

const expressServer = https.createServer({key,cert},app);

const io = socketio(expressServer,{
    cors:'*',
})

expressServer.listen(process.env.BACKEND_PORT,()=>{
    console.log("listening...");
    console.log(`https://localhost:${process.env.BACKEND_PORT}/`);
})


module.exports = {io,expressServer,app}