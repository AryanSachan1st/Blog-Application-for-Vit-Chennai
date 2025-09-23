const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/emailService');

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register a new user with OTP
const registerUser = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    // If OTP is not provided, generate and send OTP
    if (!otp) {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Generate OTP
      const generatedOTP = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // If user exists but not verified, update OTP
      if (existingUser && !existingUser.isVerified) {
        existingUser.otp = generatedOTP;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();
      } else {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with OTP
        const user = new User({
          username,
          email,
          password: hashedPassword,
          otp: generatedOTP,
          otpExpires,
          isVerified: false
        });

        // Save user to database
        await user.save();
      }

      // Send OTP email
      const emailResult = await sendOTPEmail(email, generatedOTP);
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to send OTP email'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent to your email. Please verify to complete registration.',
        emailSent: true
      });
    } else {
      // Verify OTP
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if OTP is correct and not expired
      if (user.otp !== otp) {
        return res.status(400).json({
          success: false,
          error: 'Invalid OTP'
        });
      }

      if (user.otpExpires < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'OTP has expired'
        });
      }

      // Mark user as verified
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      const savedUser = await user.save();

      // Create JWT token
      const token = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '1h' }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
          }
        }
      });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if user exists by either email or username
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Please verify your email before logging in'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user data from token
const getMe = async (req, res) => {
  try {
    // req.user is populated by authMiddleware
    const user = req.user;
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
