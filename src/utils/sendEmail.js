import transporter from "../config/nodemailer.js";

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("Sending Email To:", to);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent");
    console.log(info);

    return info;
  } catch (err) {
    console.log("EMAIL ERROR");
    console.log(err);

    throw err;
  }
};

export default sendEmail;