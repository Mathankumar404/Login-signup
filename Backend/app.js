const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/customers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected!'))
.catch(err => console.error('❌ Connection error:', err));

// Schema + Model (collection name must match)
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  Password: String, 
});

// "customer details" must exactly match your MongoDB collection name
const User = mongoose.model('User', userSchema, "customer details");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// POST /users login route

app.post('/request-reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("❌ Error in reset request:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: decoded.email },
      { $set: { Password: hashedPassword } }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Invalid or expired token:", error);
    res.status(400).json({ message: "Token expired or invalid" });
  }
});

app.post("/users", async (req, res) => {
  const { email, Password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
   
    if (user && await bcrypt.compare(Password, user.Password)) {
      res.json({ message: "Login successful" });
    } 
      else {
      console.log("Login failed for:", email, Password); // Debug
      res.status(401).json({ message: 'Invalid name or password' });
    }
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, Password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Email already exists — suggest alternatives
      const emailPrefix = email.split('@')[0];
      const emailDomain = email.split('@')[1];

      const suggestions = [
        `${emailPrefix}123@${emailDomain}`,
        `${emailPrefix}.${Math.floor(Math.random() * 1000)}@${emailDomain}`,
        `${emailPrefix}_${Date.now().toString().slice(-4)}@${emailDomain}`,
      ];

      return res.status(409).json({
        message: "Email already registered",
        suggestions: suggestions,
      });
    }

    // If not exists: proceed with password hashing and saving
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = new User({ name, email, Password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: `${name} signed up successfully` });
    console.log("✅ Signup successful:", name);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
