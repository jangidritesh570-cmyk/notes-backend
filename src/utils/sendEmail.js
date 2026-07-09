import transporter from "../config/nodemailer.js";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error);
    console.error("================================");

    throw new Error(error.message);
  }
};

export default sendEmail;