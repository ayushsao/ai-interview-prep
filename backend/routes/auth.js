// } catch (err) {
//   console.error('Registration error:', err);
//   res.status(500).json({ error: 'Registration failed', details: err.message || err });
// }} catch (err) {
//   console.error('Registration error:', err);
//   res.status(500).json({ error: 'Registration failed', details: err.message || err });
// }const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const Progress = require('../models/Progress');
// const auth = require('../middleware/auth');

// const router = express.Router();

// // Register
// router.post('/register', [
//   body('name').trim().notEmpty().withMessage('Name is required'),
//   body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password, targetRole, experienceLevel, skills } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       targetRole: targetRole || '',
//       experienceLevel: experienceLevel || 'fresher',
//       skills: skills || []
//     });

//     await user.save();

//     // Create progress document for user
//     const progress = new Progress({ user: user._id });
//     await progress.save();

//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({
//       message: 'Registration successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         targetRole: user.targetRole,
//         experienceLevel: user.experienceLevel,
//         skills: user.skills
//       }
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// });

// // Login
// router.post('/login', [
//   body('email').isEmail().normalizeEmail(),
//   body('password').notEmpty()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         targetRole: user.targetRole,
//         experienceLevel: user.experienceLevel,
//         skills: user.skills
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Login failed' });
//   }
// });

// // Get current user
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// });

// // Update profile
// router.put('/profile', auth, async (req, res) => {
//   try {
//     const { name, targetRole, experienceLevel, skills } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { name, targetRole, experienceLevel, skills },
//       { new: true }
//     ).select('-password');

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update profile' });
//   }
// });

// module.exports = router;


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * =====================
 * REGISTER
 * =====================
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      // 1️⃣ Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors.array()[0].msg,
        });
      }

      const {
        name,
        email,
        password,
        targetRole = '',
        experienceLevel = 'fresher',
        skills = [],
      } = req.body;

      // 2️⃣ Check existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: 'Email already registered',
        });
      }

      // 3️⃣ Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // 4️⃣ Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        targetRole,
        experienceLevel,
        skills,
      });

      await user.save();

      // 5️⃣ Create progress document
      await Progress.create({ user: user._id });

      // 6️⃣ Generate JWT
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 7️⃣ Success response
      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      res.status(500).json({
        error: error.message || 'Registration failed',
      });
    }
  }
);

/**
 * =====================
 * LOGIN
 * =====================
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Invalid input',
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          error: 'Invalid credentials',
        });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } catch (error) {
      console.error('❌ Login error:', error.message);
      res.status(500).json({
        error: 'Login failed',
      });
    }
  }
);

/**
 * =====================
 * GET CURRENT USER
 * =====================
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * =====================
 * UPDATE PROFILE
 * =====================
 */
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, targetRole, experienceLevel, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, targetRole, experienceLevel, skills },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
