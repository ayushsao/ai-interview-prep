// // // // 
// // // const express = require("express");
// // // const bcrypt = require("bcryptjs");
// // // const jwt = require("jsonwebtoken");
// // // const { body, validationResult } = require("express-validator");
// // // const User = require("../models/User");
// // // const Progress = require("../models/Progress");

// // // const router = express.Router();

// // // /* ================= REGISTER ================= */
// // // router.post(
// // //   "/register",
// // //   [
// // //     body("name").notEmpty().withMessage("Name required"),
// // //     body("email").isEmail().withMessage("Valid email required"),
// // //     body("password").isLength({ min: 6 }).withMessage("Password too short"),
// // //   ],
// // //   async (req, res) => {
// // //     try {
// // //       console.log("📩 Register request:", req.body);

// // //       const errors = validationResult(req);
// // //       if (!errors.isEmpty()) {
// // //         return res.status(400).json({ errors: errors.array() });
// // //       }

// // //       const { name, email, password, targetRole, experienceLevel } = req.body;

// // //       const existingUser = await User.findOne({ email });
// // //       if (existingUser) {
// // //         return res.status(400).json({ error: "Email already registered" });
// // //       }

// // //       const hashedPassword = await bcrypt.hash(password, 10);

// // //       const user = await User.create({
// // //         name,
// // //         email,
// // //         password: hashedPassword,
// // //         targetRole: targetRole || "",
// // //         experienceLevel: experienceLevel || "fresher",
// // //       });

// // //       // optional but safe
// // //       await Progress.create({ user: user._id });

// // //       if (!process.env.JWT_SECRET) {
// // //         console.error("❌ JWT_SECRET missing");
// // //         return res.status(500).json({ error: "Server config error" });
// // //       }

// // //       const token = jwt.sign(
// // //         { userId: user._id },
// // //         process.env.JWT_SECRET,
// // //         { expiresIn: "7d" }
// // //       );

// // //       console.log("✅ User registered:", user.email);

// // //       return res.status(201).json({
// // //         message: "Registration successful",
// // //         token,
// // //         user: {
// // //           id: user._id,
// // //           name: user.name,
// // //           email: user.email,
// // //           targetRole: user.targetRole,
// // //           experienceLevel: user.experienceLevel,
// // //         },
// // //       });
// // //     } catch (err) {
// // //       console.error("❌ Register error:", err);
// // //       return res.status(500).json({ error: "Registration failed" });
// // //     }
// // //   }
// // // );

// // // module.exports = router;
// // const express = require("express");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const { body, validationResult } = require("express-validator");
// // const User = require("../models/User");
// // const Progress = require("../models/Progress");

// // const router = express.Router();

// // router.post(
// //   "/register",
// //   [
// //     body("name").notEmpty(),
// //     body("email").isEmail(),
// //     body("password").isLength({ min: 6 }),
// //   ],
// //   async (req, res) => {
// //     console.log("📩 REGISTER HIT:", req.body);

// //     try {
// //       const errors = validationResult(req);
// //       if (!errors.isEmpty()) {
// //         return res.status(400).json({ errors: errors.array() });
// //       }

// //       const { name, email, password, targetRole, experienceLevel } = req.body;

// //       const exists = await User.findOne({ email });
// //       if (exists) {
// //         return res.status(400).json({ error: "Email already exists" });
// //       }

// //       const hashed = await bcrypt.hash(password, 10);

// //       const user = await User.create({
// //         name,
// //         email,
// //         password: hashed,
// //         targetRole: targetRole || "",
// //         experienceLevel: experienceLevel || "fresher",
// //       });

// //       await Progress.create({ user: user._id });

// //       if (!process.env.JWT_SECRET) {
// //         return res.status(500).json({ error: "JWT_SECRET missing" });
// //       }

// //       const token = jwt.sign(
// //         { userId: user._id },
// //         process.env.JWT_SECRET,
// //         { expiresIn: "7d" }
// //       );

// //       return res.status(201).json({
// //         message: "Registration successful",
// //         token,
// //         user: {
// //           id: user._id,
// //           name: user.name,
// //           email: user.email,
// //           targetRole: user.targetRole,
// //           experienceLevel: user.experienceLevel,
// //         },
// //       });
// //     } catch (err) {
// //       console.error("❌ REGISTER ERROR:", err);
// //       return res.status(500).json({ error: "Registration failed" });
// //     }
// //   }
// // );

// // module.exports = router;
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// router.post("/login", async (req, res) => {
//   try {
//     console.log("📩 LOGIN HIT:", req.body);

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     if (!process.env.JWT_SECRET) {
//       return res.status(500).json({ error: "JWT_SECRET missing" });
//     }

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     console.log("✅ Login success:", email);

//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         targetRole: user.targetRole,
//         experienceLevel: user.experienceLevel,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     return res.status(500).json({ error: "Login failed" });
//   }
// });
router.post("/register", async (req, res) => {
  try {
    console.log("📩 REGISTER HIT:", req.body);

    const { name, email, password, targetRole, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword, // ✅ HASHED
      targetRole,
      experienceLevel,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ User registered:", email);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});
