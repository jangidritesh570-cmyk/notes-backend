import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    // ===============================
    // Forgot Password Fields
    // ===============================

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ===================================
// Hash Password Before Save
// ===================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// ===================================
// Compare Password
// ===================================

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ===================================
// Generate JWT Token
// ===================================

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// ===================================
// Generate Password Reset Token
// ===================================

userSchema.methods.createPasswordResetToken = function () {
  // Generate Random Token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save Hashed Token in Database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token Valid for 15 Minutes
  this.passwordResetExpire = Date.now() + 15 * 60 * 1000;

  // Return Original Token
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;