const express = require("express");
const router = express.Router();

const {
  getSingleAppointment,
  getAllClientAppointment,
  addAppointment,
  deleteAppointment,
} = require("../controllers/appointment.controller");
const { isProfessionalMiddleware } = require("../middlewares/isProfessional.middleware");

/**
 * /appointment
 * 
 */
router
  .get("/getSingleAppointment/:_id", getSingleAppointment)
  .get("/getAllClientAppointments", getAllClientAppointment)
  .post("/addAppointment",isProfessionalMiddleware, addAppointment)
  .post('/deleteAppointment',deleteAppointment)

exports.appointmentRoute = router