const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { check, validationResult } = require("express-validator/check");
// data model
const User = require("../models/User");
// initialize the router
const router = express.Router();


// * @route   GET  api/auth
// * @desc     Get logged in user
// * @access  Private
router.get("/", (req, res) => {
  res.send("Get logged in user");
});

// * @route   POST  api/auth
// * @desc     Auth user & get token
// * @access  Public
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "include valid email").isEmail(),
    check("password", "password must be 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();



      const payload = 


    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
