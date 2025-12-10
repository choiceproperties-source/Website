import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import crypto from "crypto";
import UserModel from "../models/User.js";
import transporter from "../config/nodemailer.js";
import { getWelcomeTemplate } from "../email.js";
import { getPasswordResetTemplate } from "../email.js";

const backendurl = process.env.BACKEND_URL;

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.json({ message: "Email not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createtoken(user.id);
      return res.json({ token, user: { name: user.name, email: user.email }, success: true });
    } else {
      return res.json({ message: "Invalid password", success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", success: false });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email", success: false });
    }
    
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.json({ message: "Email already registered", success: false });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ name, email, password: hashedPassword });
    const token = createtoken(newUser.id);

    // Send welcome email asynchronously (don't block signup)
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Choice Properties - Your Account Has Been Created",
      html: getWelcomeTemplate(name)
    };

    // Non-blocking email send
    transporter.sendMail(mailOptions).catch(err => {
      console.warn('Welcome email failed to send:', err.message);
    });

    return res.json({ token, user: { name: newUser.name, email: newUser.email }, success: true });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email not found", success: false });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    await UserModel.update(user.id, {
      resetToken: resetToken,
      resetTokenExpire: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });
    
    const resetUrl = `${process.env.WEBSITE_URL}/reset/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset - Choice Properties Security",
      html: getPasswordResetTemplate(resetUrl)
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpire: null
    });
    return res.status(200).json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, success: true });
    } else {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const logout = async (req, res) => {
    try {
        return res.json({ message: "Logged out", success: true });
    } catch (error) {
        console.error(error);
        return res.json({ message: "Server error", success: false });
    }
};

const getname = async (req, res) => {
  try {
    const user = await UserModel.getById(req.user.id);
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }
  catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
}

export { login, register, forgotpassword, resetpassword, adminlogin, logout, getname };
