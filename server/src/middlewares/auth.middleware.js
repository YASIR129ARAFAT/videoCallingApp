const jwt = require('jsonwebtoken')
const {User} = require('../models/user.models.js')
const { asyncHandler } = require('../utils/asyncHandler.js')
exports.authMiddleware = asyncHandler(async (req, res, next) => {
    //take out the token
    // it could be either in cookies or 
    //user could have sent it in the header

   
    let token =  req.header("token")||null
    
     //if token is not present in the req.header it will return an string "null" instead of null
    if(token=="null") token = null;
    
    if(!token){
        throw new Error('unauthorised access!!')
    }
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!decoded){
        throw new Error('unauthorised access!!')
    }

    const id = decoded?._id;

    // take out the details of the user from the db
    const user = await User.findById(id).select("-password -refreshToken");
    
    if(!user){
        throw new Error('unauthorised access!!')
    }

    // place the obtained detail from db into the res object using any keyname (like user) 
    req.user = user;
   
    next()
    

});