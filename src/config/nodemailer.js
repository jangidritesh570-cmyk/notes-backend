import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jangidritesh570@gmail.com",
    pass: "yvjjapinpygpdzsx",
  },
});

transporter.verify((err) => {
  console.log(err || "SMTP Connected");
});

export default transporter;