const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const generateTokens = (user) => {

    const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "30m" } );

    const refreshToken = jwt.sign({ id: user._id },process.env.JWT_SECRET,{ expiresIn: "8h" });

    return { accessToken, refreshToken };
};

exports.createUser = async (req, res) => {
  try {

    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email:email });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }

    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists"  }); 
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain only letters and numbers"}); 
    }

    const phoneRegex = /^[0-9]{10}$/;
 
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone number must be exactly 10 digits and contain only numbers"});
    }

    const user = new User({  name,  email,  phone,  password: hashedPassword});

    const savedUser = await user.save();

    res.status(201).json({  success: true,  message: "User registered successfully",  data: savedUser});

  } catch (error) {
       res.status(500).json({ success: false, message: error.message });
  }
};


exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) { 
        return res.status(404).json({ success: false,  message: "User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) { 
        return res.status(401).json({ success: false, message: "Invalid password" });
     }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({ success: true,accessToken, refreshToken, data: user });

    } catch (error) {  
        res.status(500).json({ success: false,  message: error.message});
  }

};


// exports.refreshToken = (req, res) => {

//     const { refreshToken } = req.body;

//     if (!refreshToken) { 
//         return res.status(401).json({ success: false, message: "Refresh token required" }); 
//     }

//     jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {

//         if (err) { 
//             return res.status(403).json({ success: false, message: "Invalid refresh token" });
//         }
        
//         const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30m" } );

//         res.json({ success: true, accessToken });
//     });

// };


// exports.getUsers = async (req, res) => {

//     try {
//         const users = await User.find();

//         res.json({ success: true, data: users });
        
//         } catch (error) { 
//              res.status(500).json({ success: false, message: error.message });
//     }

// };

exports.getUsers = async (req, res) => {
  try {

    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    res.status(200).json({ success: true, message: "Users fetched successfully", data: users});

  }  catch (error) { 
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
   }
};
