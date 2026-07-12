const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Notes App",
          email: process.env.EMAIL_FROM,
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

    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Email failed");
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default sendEmail;