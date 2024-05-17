const fs = require('fs')
const express = require('express')
const https = require('https')
const socketio = require('socket.io')
const app = express()

app.use(express.static('../public'))

const key = fs.readFileSync('./certs/cert.key')
const cert = fs.readFileSync('./certs/cert.crt')

const expressServer = https.createServer({key,cert},app);

const io = socketio(expressServer,{
    cors:'*',
})

const port = 3000;
expressServer.listen(port,()=>{
    console.log("listening...");
    console.log(`https://localhost:${port}/`);
})


module.exports = {io,expressServer,app}