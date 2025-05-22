const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');

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
  Password: String, // Capital "P" is important!
});

// "customer details" must exactly match your MongoDB collection name
const User = mongoose.model('User', userSchema, "customer details");

// POST /users login route
app.post("/users", async (req, res) => {
  const { email, Password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    const allUsers = await User.find();
    
   
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
