import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

import crypto from "crypto";

// ==============================
// Register
// ==============================

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.generateToken();

  res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  );
});

// ==============================
// Login
// ==============================

export const loginUser = asyncHandler(async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    console.log(email, password);

    const user = await User.findOne({ email }).select("+password");

    console.log("USER:", user);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    console.log("PASSWORD MATCH:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = user.generateToken();

    res.status(200).json(
      new ApiResponse(200, "Login successful", {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      })
    );
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    throw err;
  }
});

// ==============================
// Current User
// ==============================

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json(
    new ApiResponse(200, "Current user fetched", user)
  );
});

// ==============================
// Logout
// ==============================

export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "Logout successful")
  );
});

// ==============================
// Forgot Password
// ==============================

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL =
    `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
      <div style="font-family:Arial;padding:30px">
          <h2>Notes App Password Reset</h2>

          <p>Hello <b>${user.name}</b>,</p>

          <p>You requested a password reset.</p>

          <a
              href="${resetURL}"
              style="
                background:#2563eb;
                color:white;
                padding:12px 20px;
                border-radius:6px;
                text-decoration:none;
                display:inline-block;
              "
          >
              Reset Password
          </a>

          <p style="margin-top:20px">
            This link will expire in 15 minutes.
          </p>

          <p>If you didn't request this email,
          please ignore it.</p>
      </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset Password - Notes App",
    html,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      "Password reset email sent successfully"
    )
  );
});

// ==============================
// Reset Password
// ==============================

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: {
      $gt: Date.now(),
    },
  }).select("+password");

  if (!user) {
    throw new ApiError(
      400,
      "Reset token is invalid or expired"
    );
  }

  user.password = req.body.password;

  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      "Password reset successful"
    )
  );
});