const { asyncHandler } = require("../utils/asyncHandler")

const isProfessionalMiddleware = asyncHandler(async(req,res,next)=>{
    const userType = req?.user?.userType

    if(userType === "professional"){
        next();
    }else{
        throw new Error("Unauthorised Access!!")
    }
})

module.exports = {isProfessionalMiddleware}