import crypto from "crypto";

import User from "../models/User.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import sendEmail from "../utils/sendEmail.js";


// ============================================
// Register User
// ============================================

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


// ============================================
// Login User
// ============================================

export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

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
});


// ============================================
// Forgot Password
// ============================================

export const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({
        validateBeforeSave: false,
    });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
Hello ${user.name},

Click the link below to reset your password.

${resetURL}

This link will expire in 15 minutes.

If you didn't request this, ignore this email.
`;

    try {

        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            text: message,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                "Password reset link sent successfully"
            )
        );

    } catch (error) {

        user.passwordResetToken = null;
        user.passwordResetExpire = null;

        await user.save({
            validateBeforeSave: false,
        });

        throw new ApiError(
            500,
            "Email could not be sent"
        );
    }

});


// ============================================
// Reset Password
// ============================================

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

    user.passwordResetToken = null;
    user.passwordResetExpire = null;

    await user.save();

    res.status(200).json(
        new ApiResponse(
            200,
            "Password reset successful"
        )
    );
});


// ============================================
// Current User
// ============================================

export const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Current user fetched successfully",
            user
        )
    );

});


// ============================================
// Logout
// ============================================

export const logoutUser = asyncHandler(async (req, res) => {

    res.status(200).json(
        new ApiResponse(
            200,
            "Logout successful"
        )
    );

});