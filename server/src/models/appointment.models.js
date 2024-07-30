const mongoose = require('mongoose');

const { Schema } = mongoose;


const AppointmentSchema = new Schema(
    {
        professionalId:{
            type: mongoose.Schema.ObjectId,
            required:true,
            ref:'User'
        },
        clientId:{
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:'User'
        },
        apptDate: {
            type: Date,
            required:true
        }
    },{
        timestamps:true,
    }
)



exports.Appointment = mongoose.model("Appointment",AppointmentSchema);