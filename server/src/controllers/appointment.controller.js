const { Appointment } = require("../models/appointment.models");
const { asyncHandler } = require("../utils/asyncHandler");
const sendAppointmentScheduleEmail = require("../utils/Mails/AppointmentScheduleEmails/appointmentScheduleEmail");
const getAppointmentScheduledHtml = require("../utils/Mails/AppointmentScheduleEmails/htmlAppointmentSchedule");

exports.addAppointment = asyncHandler(async (req, res) => {
  console.log("dsd", req.body);
  let { clientId, apptDate } = req.body;
  let {_id} = req.user;

  let professionalId = _id;

  if(apptDate === ""){
    res.json({ success: 0, errorMessage: "Appoinment date can't be empty" });
    return;
  }


  const date = new Date(apptDate).getTime();
  // console.log("date: ", date);


   apptDate = new Date(apptDate).toISOString();
  // console.log(apptDate);

  if (date < Date.now()) {
    res.json({ success: 0, errorMessage: "Appoinment date can't be in the past" });
    return;
  }
  const appointment = new Appointment({
    clientId,
    professionalId,
    apptDate,
  });

  await appointment.save();

  const apptData = await Appointment
                        .findById(appointment?._id)
                        .populate({
                            path: "clientId",
                            select: "name email image dob gender mobile userType",
                        })
                        .populate({
                            path: "professionalId",
                            select: "name email image dob gender mobile userType",
                        });

  //add an email functionality to inform client about appointment booking
  const to = apptData?.clientId?.email
  const subject = `Appointment Scheduled Successfully`
  const text = ``
  const html = getAppointmentScheduledHtml(apptData)

  // console.log(to,subject,html);

  // console.log("dhjsbdsv::","info");
  const info = await sendAppointmentScheduleEmail(to, subject, text, html);

  res.json({ success: 1, apptData });
});
exports.getAllClientAppointment = asyncHandler(async (req, res) => {
  const  {_id}  = req.user;

  const allAppointments = await Appointment
                                    .find({ clientId: _id })
                                    .populate({
                                        path: "clientId",
                                        select: "name email image dob gender mobile userType",
                                    })
                                    .populate({
                                        path: "professionalId",
                                        select: "name email image dob gender mobile userType",
                                    });

  // console.log( allAppointments);

  res.json({ success: 1, allAppointments });
});
exports.getSingleAppointment = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const apptData = await Appointment
                        .findById(_id)
                        .populate({
                            path: "clientId",
                            select: "name email image dob gender mobile userType",
                        })
                        .populate({
                            path: "professionalId",
                            select: "name email image dob gender mobile userType",
                        });

  res.json({ success: 1, apptData });
});
exports.deleteAppointment = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  // console.log("djsbddsjbsh");
  const appointment = await Appointment.deleteOne({ _id });

  res.json({ success: 1, appointment });
});
