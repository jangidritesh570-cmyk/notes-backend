const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Notes App",
          email: "jangidritesh570@gmail.com",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data);
      throw new Error(data.message || "Email send failed");
    }

    console.log("✅ Email Sent");
    console.log(data);

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default sendEmail;