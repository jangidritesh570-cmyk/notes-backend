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

// ===============================
// Public Routes
// ===============================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.put("/reset-password/:token", resetPassword);

// ===============================
// Protected Routes
// ===============================

// Current User
router.get("/me", protect, getCurrentUser);

// Logout
router.post("/logout", protect, logoutUser);

export default router;