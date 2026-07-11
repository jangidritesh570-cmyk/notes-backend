import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Notes Backend Running Successfully",
  });
});

app.use(errorHandler);

export default app;