exports.asyncHandler = (func)=>{
    return async function(req,res,next){
        try{
            await func(req,res,next);
        }
        catch(error){
            // console.log("hhhhh",error);
            res.status(400).json({success:0,message:error?.message || "Internal server error"})
        }
    }
}

