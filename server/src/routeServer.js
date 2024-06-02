const {app} = require('./server.js')
const jwt = require('jsonwebtoken')
app.get('/',(req,res)=>{
    res.send("hello")
})
const secret = 'yasir129'
app.get('/user-link',async(req,res)=>{
    try {
        const user = {
            name:'John Doe',
            apptDate: Date.now()+800000,
            age:23,
            gender:'M'
        }
        const token =  await jwt.sign(user,secret);
    
        res.send(token)
    } catch (error) {
        console.log(error);
    }
})

app.post('/verify-link',async(req,res)=>{
    try {
        const {token} = req.body
        // console.log("token");
        // console.log(token);
        const user = await jwt.verify(token,secret);
    
        res.json(user);
    } catch (error) {
        console.log(error);
    }
})