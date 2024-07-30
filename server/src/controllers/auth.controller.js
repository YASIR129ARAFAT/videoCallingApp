const jwt = require("jsonwebtoken")
const { User } = require('../models/user.models.js');
const getHtml = require('../utils/Mails/RegistrationEmails/htmlEmailBody.js');
const sendRegistrationEmail = require('../utils/Mails/RegistrationEmails/registrationEmail.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const sendForgotPasswordEmail = require("../utils/Mails/ForgotPasswordEmails/forgotPasswordEmail.js");
const getForgotPasswordHtml = require("../utils/Mails/ForgotPasswordEmails/htmlForgotPassword.js");


exports.createUser = asyncHandler(async (req, res) => {

    // console.log(req.file);

    let formData = req.body
    // console.log("req.body");
    // console.log(req.body);

    // trim all values of the formData
    for (const [key, value] of Object.entries(formData)) {
        const newValue = value.trim().trimStart()
        formData[key] = newValue;
    }

    let flag = 0;
    let error = {}

    Object.entries(formData).forEach(([key, value]) => {
        if (value === "") {
            const newKey = key.toString() + "Error";
            error = { ...error, [newKey]: `${key} can't be empty` };
            flag++;
        }
    });

    let { password, confirmPassword, name, email, mobile, gender, dob,  userType } = formData

    userType = userType.toLowerCase()
    if (password.length < 4) {
        error = { ...error, passwordError: "Passwords must be of 4 or more characters" }
        flag++;
    }
    if (password !== confirmPassword) {
        error = { ...error, passwordError: "Passwords and confirm password not matching" }
        flag++;
    }

    if (mobile.length != 10) {
        error = { ...error, mobileError: "Invalid mobile number" }
        flag++;
    }



    checkUser = await User.findOne({ email });
    if (checkUser) {
        error = { ...error, emailError: "email already in use!!" }
        flag++;
    }



    if (flag > 0) {
        // console.log("erorr: ",error);
        return res.json({ success: 0, error });
        // throw new apiError(error,"messae from me", 500)
    }


    const user = new User({
        email,
        name,
        gender,
        userType,
        mobile,
        dob,
        password,
    });
    await user.save();

    // console.log("userType def: ",typeof userType);
    // console.log("userType: ",userType);

    //send email for successfull registration
    const to = email
    const subject = `Registration for Placements Sucessful`
    const text = ``
    const html = getHtml(name,userType)


    // console.log("dhjsbdsv::","info");
    const info = await sendRegistrationEmail(to, subject, text, html);
    // console.log("dhjsbdsv::",info);
    //not safe to send password and token to user as response so remove them from object
    let { password: omit_pass, token, ...restObj } = formData
    // since password is already used as a name for var we used `password:omit_pass`
    // console.log("User Registered Successfully")
    // console.log(restObj)
    res.json({ user: restObj, success: 1, successMessage: "User Registered Successfully" });

})

const genAccessToken = async (user_id) => {

    try {
        let user = await User.findById(user_id)
        console.log(user);
        const accessToken = await user.generateAccessToken();


        await user.save({ validateBeforeSave: false });

        return { accessToken };
    } catch (error) {
        // console.log(error);
        res.json({ success: 0, error: { message: "server unable to generate tokens" } });
    }

}
exports.login = asyncHandler(async (req, res) => {

    // console.log("req.body,dfd");
    // console.log(req.body);
    let { email, password } = req.body;

    //trim the values
    email = email.trim().trimStart().toLowerCase()
    password = password.trim().trimStart()

    if (email === "") {
        return res.json({ success: 0, error: { emailError: "email can't be empty" } });
    }
    if (password === "") {
        return res.json({ success: 0, error: { passwordError: "password can't be empty" } });
    }



    const user = await User.findOne({email}) // and condition

    if (user) {
        console.log(user.password)
        const isMatch = await user.isPasswordCorrect(password);

        if (isMatch === true) {

            const { accessToken } = await genAccessToken(user._id);
            // console.log({accessToken,refreshToken})
            console.log("login successfull..");

            //prepare user data to be sent as response
            //user obtained from db may not be a json object so first we convert it into an object
            //By calling .toObject() on the user object, you convert it to a plain JavaScript object, excluding the Mongoose-specific metadata.
            const { password: omit_pass, ...responseData } = user.toObject()
            responseData.token = accessToken;
            

            res.status(201)
                .json({ success: 1, message: "login succesfull", error: {}, user: responseData });
        }
        else {
            res.json({ success: 0, error: { passwordError: "Wrong password" } });
        }
    }
    else {
        res.json({ success: 0, error: { emailError: "User does not exist" } });
        // res.send("<>hdbcd</>")
    }

})


// reset password for the case of forgot password 
exports.resetForgotPassword = asyncHandler(async (req, res) => {
    let { email } = req.body;
    email = email.trim().trimStart();
    // console.log("sds");

    let user = await User.find({ email })
    user = user[0];
    if (user) {
        // console.log(user);
        const { _id, email, password } = user;
        const secret = process.env.FORGOTPASSWORD_JWT_SECRET + password;
        // console.log("1: -> ",secret);
        const payload = {
            email,
            password,
            id: _id
        }
        const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // token expires in 4hrs
        const resetLink = `${process.env.FRONTEND_URL}/reset/${_id}?token=${token}`

        //send email
        const to = email
        const subject = "Account Password Reset"
        const text = ''
        const html = getForgotPasswordHtml(resetLink);

        await sendForgotPasswordEmail(to, subject, text, html);

        res.json({ success: 1, message: "Mail sent Sucessfully!!" });
    }
    else {
        res.json({ success: 0, message: "Email does not exist!!!!" })
    }
})


exports.resetFinalForgotPassword = asyncHandler(async (req, res) => {
    const { id, token } = req.params
    let { confirmPassword, password } = req.body

    // console.log("inside",req.params);

    confirmPassword = confirmPassword.trim().trimStart()
    password = password.trim().trimStart()

    //form validation
    if (password !== confirmPassword) {
        res.json({ success: 0, message: "Password and ConfirmPassword not matching!!!" })
        return;
    }

    if (password.length < 4) {
        res.json({ success: 0, message: "Password must be of atleast 4 characters!!!" })
        return;
    }

    let user = await User.find({ _id: id });
    user = user[0];

    if (!user) {
        res.json({ success: 0, message: "Invalid reset link!!" })
        return;
    }

    // console.log("caaa");
    // verify token
    const secret = process.env.FORGOTPASSWORD_JWT_SECRET + user.password

    const decoded = jwt.verify(token, secret);

    if (!decoded) {
        res.json({ success: 0, message: "Invalid reset link!!!!!" })
        return;
    }

    user.password = password
    await user.save({ validateBeforeSave: false })

    // console.log("daaa");

    res.json({ success: 1, message: "Password Changed Successfully!!!" })



})


