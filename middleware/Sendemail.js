const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {

  var transporter = nodeMailer.createTransport({
    service:'gmail',
    auth: {
      user: "fahadali93073@gmail.com",
      pass: "yceawckbmzbyhsmh"
    }
  });
  

  const mailOptions = {
    from: "Malcider <no-reply@malcider.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //console.log(mailOptions);
  await transporter.sendMail(mailOptions);
};