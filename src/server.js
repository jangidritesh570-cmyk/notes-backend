import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

// Optional (Debug)
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_HOST:", process.env.SMTP_HOST);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Failed to Start");
    console.error(error);
  }
};

startServer();