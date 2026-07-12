import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});