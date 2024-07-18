const multer = require("multer")
const { v4: uuidv4 } = require('uuid'); // importing v4 as uuidv4
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!file) return;
        cb(null, "../public/temp/") // the upload path is given relative to the file where your server is running
    },
    filename: function (req, file, cb) {
        if(!file) return;
        const uniqueSuffix = uuidv4()
        const fileExtension = path.extname(file.originalname)
        const fileName = path.basename(file.originalname, fileExtension)
        
        // console.log("Original filename:", file.originalname)
        // console.log("File extension:", fileExtension)
        // console.log("File name without extension:", fileName)
        // console.log("MIME type:", file.mimetype)
        // console.log("File size (if available):", file.size)

        const newFilename = `${fileName}-${uniqueSuffix}${fileExtension}`
        // console.log("New filename:", newFilename)

        cb(null, newFilename)
    }
})

exports.upload = multer({ storage })