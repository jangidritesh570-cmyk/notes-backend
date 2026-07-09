import transporter from "../config/nodemailer.js";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent:", info);

    return info;
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Response Code:", error.responseCode);
    console.error("===============================");

    throw error; // IMPORTANT
  }
};

export default sendEmail;