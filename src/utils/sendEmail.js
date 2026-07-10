import resend from "../config/resend.js";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Notes App <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent");
    console.log(response);

    return response;
  } catch (error) {
    console.error("❌ RESEND ERROR");
    console.error(error);

    throw error;
  }
};

export default sendEmail;