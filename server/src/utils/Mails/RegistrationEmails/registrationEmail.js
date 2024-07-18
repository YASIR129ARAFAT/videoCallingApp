const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "atherjamal909@gmail.com",
    pass: "cbsxzbhebgkgtbnu",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendRegistrationEmail(to,subject,text,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'atherjamal909@gmail.com', // sender address
    to, // list of receivers or a single one
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

  return info

}

module.exports = sendRegistrationEmail

