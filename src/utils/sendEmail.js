import apiInstance from "../config/brevo.js";
import * as brevo from "@getbrevo/brevo";

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("Sending Email To:", to);

    const email = new brevo.SendSmtpEmail();

    email.sender = {
      name: process.env.EMAIL_FROM_NAME,
      email: process.env.EMAIL_FROM,
    };

    email.to = [
      {
        email: to,
      },
    ];

    email.subject = subject;

    email.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(email);

    console.log("✅ Email Sent Successfully");
    console.log(response);

    return response;
  } catch (err) {
    console.log("EMAIL ERROR");
    console.log(err);

    throw err;
  }
};

export default sendEmail;