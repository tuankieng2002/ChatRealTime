const nodeMailer = require('nodemailer')

const sendMail = async (email, subject, text) => {
    const transport = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text,
    });
  };

module.exports = sendMail;