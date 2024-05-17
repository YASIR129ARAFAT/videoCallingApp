const {io} = require('./server.js')

io.on('connection',(socket)=>{
    console.log("connected",socket);
})