import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// =======================
// Public Routes
// =======================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

// =======================
// Protected Routes
// =======================

router.get("/me", protect, getCurrentUser);

router.post("/logout", protect, logoutUser);

export default router;