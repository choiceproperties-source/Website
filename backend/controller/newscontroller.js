import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";
import { getNewsletterTemplate } from "../email.js";
import NewsModel from "../models/News.js";

dotenv.config();

const submitNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required',
        success: false 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address',
        success: false 
      });
    }

    const existingSubscription = await NewsModel.findByEmail(email);
    if (existingSubscription) {
      return res.status(400).json({ 
        message: 'Email already subscribed to newsletter',
        success: false 
      });
    }

    await NewsModel.create({ email });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Choice Properties Newsletter!",
      html: getNewsletterTemplate(email),
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: "Newsletter subscribed successfully",
      success: true 
    });
  } catch (error) {
    console.error("Error saving newsletter data:", error);
    res.status(500).json({ 
      message: "Server error",
      success: false 
    });
  }
};

export { submitNewsletter };
