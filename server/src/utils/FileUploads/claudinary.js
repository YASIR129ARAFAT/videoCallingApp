const {v2:cloudinary} = require('cloudinary')
const fs = require('fs')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


exports. uploadOnCloudinary = async(localFilePath,fileType="auto") =>{
    try {
        if (!localFilePath) return null

        //upload the file on claudinary and get the response
        const response = await cloudinary
            .uploader
            .upload(
                localFilePath,
                {
                    resource_type: fileType
                }
            )
            // response will contain alot of info including the url where it is uploaded
            // console.log("succes in file upload on URL",response.url);

            fs.unlinkSync(localFilePath) // remove the file from the local storage
            
            return response

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the file from the temporary storage
        return null
    }
}

