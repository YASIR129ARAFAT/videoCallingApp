
// const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))
// let users = data.users;


const { User } = require('../models/user.models');
const { uploadOnCloudinary } = require('../utils/FileUploads/claudinary');
const { asyncHandler } = require('../utils/asyncHandler');


exports.getUser = asyncHandler(async (req, res) => {
    const _id = req.params?.id;

    const users = await User.findById(_id).select('-password')
        .exec()

    res.json(users);

})
exports.updateUser = asyncHandler(async (req, res) => {

    const id = req.params?.id;
    let updatedValues = req.body;

    console.log(req.body);


    // trim all values of the formData
    for (const [key, value] of Object.entries(updatedValues)) {

        const newValue = value.trim().trimStart()
        updatedValues[key] = newValue;

    }

    let flag = 0;
    let error = {}
    Object.entries(updatedValues).forEach(([key, value]) => {
        if (value === "") {
            const newKey = key.toString() + "Error";
            error = { ...error, [newKey]: `${key} can't be empty` };
            flag++;
        }


    });

    if (updatedValues?.mobile?.length != 10) {
        // console.log(updatedValues?.mobile?.length);
        error = { ...error, mobileError: "Invalid mobile number" }
        flag++;
    }

    if (flag > 0) {
        return res.json({ success: 0, error });
    }


    //get the current local path of the uploaded image
    // following gives the current local path where the file is uploaded
    let profileImageLocalPath = null // image may not be uploaded
    if (req.files?.profileImage?.length) {
        // if the file is sent fromt the user side then upload it
        profileImageLocalPath = req.files?.profileImage[0]?.path
        // upload the file on cloudinary
        const { url } = await uploadOnCloudinary(profileImageLocalPath)

        updatedValues.image = url;
    }

    //    console.log("final val",updatedValues);

    const user = await User.findByIdAndUpdate(id, updatedValues, { new: true });
    res.json({ success: 1, user, error })

})

// /api/user/loggerInUserDetails
exports.getLoggedInUserDetails = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    // console.log("here",_id);
    let data = await User.findById(_id)
        .select(" -password");
    // console.log(data);
    res.json(data);
})

exports.getAllUser = asyncHandler(async (req, res) => {
    // console.log('hii');

    let getProfessionalOnly = req.params?.getProfessionalOnly
    getProfessionalOnly = (getProfessionalOnly === "false") ? (false) : (true);
    console.log(getProfessionalOnly);
     
    if (getProfessionalOnly === true) {
        // console.log("hiii from boolean");
        const users = await User.find({ userType: "professional" });

        res.json(users);
    }
    else {
        const users = await User.find({ userType: "patient" });

        res.json(users);
    }



})


exports.changePassword = asyncHandler(async (req, res) => {

    const { password, newPassword, confirmNewPassword } = req.body;
    // console.log(req.body);
    const updatedValues = req.body
    let flag = 0;
    let error = {}
    Object.entries(updatedValues).forEach(([key, value]) => {
        if (value === "") {
            const newKey = key.toString() + "Error";
            error = { ...error, [newKey]: `${key} can't be empty` };
            flag++;
        }
    });

    if (flag) {
        return res.json({
            sucess: 0,
            errors: error,
            message: ""
        })
    }


    if (newPassword !== confirmNewPassword) {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Confirm new password and new password not matching"
            },
            message: ""
        })
    }

    if (password === newPassword) {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Please type a password different from current password!!"
            },
            message: ""
        })
    }

    const id = req.user?._id;
    const user = await User.findById(id);

    if (!user) {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Unauthorized access"
            },
            message: ""
        })
    }

    const isMatch = await user.isPasswordCorrect(password)

    if (isMatch === true) {
        user.password = newPassword;
        await user.save({ validateBeforeSave: false })
        return res
            .status(200)
            .json({
                sucess: 1,
                message: "password changed successfully!!!",
                errors: {}
            })
    }
    else {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Wrong old password"
            },
            message: ""
        })
    }

})

