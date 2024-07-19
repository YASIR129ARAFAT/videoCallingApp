const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');


const UserSchema = new Schema(
    {
        name: { type: String, required: [true, 'Name is mandatory'], trim: true, index: true },
        email: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            },
            required: [true, 'User email is required'],
            unique: [true, 'Email already used'],
            trim: true,
            index: true, // makes the search on the basis of email (this property) optimised
            lowercase: true
        },
        mobile: { type: String, required: true, trim: true },
        gender: { type: String, required: true, trim: true },
        dob: { type: Date, required: [true, 'DOB value is mandatory'] },
        password: {
            type: String,
            required: [true, 'password value is mandatory'],
            trim: true
        },
        userType:{
            type:String,
            default:'patient'
        },
        image: {
            type: String,
            default: ""
        }
    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
        timestamps: true, // this will automatically create two more entries in user table named as "createdAt" and "updatedAt"
       
    }
)

// .pre is a middleware that runs a given function just before the specified event
UserSchema.pre("save", async function (next) { // the arrow function will not work here because it does not have "this" (current context) in its params
    if (this?.isModified("password") === true) { // isModified is a built in function that keeps track of modified fields.
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();

})
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            enrolmentNo: this.enrolmentNo

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}


UserSchema.virtual('formattedDOB').get( function(){
    let dob =  this?.dob 
    // console.log("dob+",dob);

    /**
     * for populating if virtual attribute is not selected then it will give an error
        because mongodb will try to add virtual object from some object which is not present in
        the result
     * to avoid this always add a conditional check in before creating a virtual object
     */

    if(!dob) return null;

    dob = dob.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'})
    // console.log("dob+2",dob);

    return dob
})

exports.User = mongoose.model('User', UserSchema) // it will create a db as users automatically


