import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed Origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman or server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api", routes);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Notes API Running Successfully",
  });
});

// Error Middleware
app.use(errorHandler);

export default app;