import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_USER:", process.env.SMTP_USER);

await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});