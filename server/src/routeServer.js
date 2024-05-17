const {app} = require('./server.js')

app.get('/',(req,res)=>{
    res.send("hello")
})