const nodemailer = require("nodemailer");

const sendEmail = async (
  recipient_address,
  subject_name,
  plain_content,
  html_content
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.APP_EMAIL_ADDRESS,
      pass: process.env.APP_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "Airseat",
      address: process.env.APP_EMAIL_ADDRESS,
    },
    to: recipient_address, // list of receivers
    subject: subject_name, // Subject line
    text: plain_content, // plain text body
    html: html_content, // html body
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
