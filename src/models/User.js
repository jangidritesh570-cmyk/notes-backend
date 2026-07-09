import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // Forgot Password
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

// ===============================
// Hash Password
// ===============================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ===============================
// Compare Password
// ===============================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ===============================
// Generate JWT
// ===============================
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

// ===============================
// Generate Reset Password Token
// ===============================
userSchema.methods.createPasswordResetToken = function () {
  // Random Token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save Hashed Token
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Expire after 15 minutes
  this.passwordResetExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;