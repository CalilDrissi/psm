const express = require('express');
const config = require("config");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require('../middleware/auth');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { findById } = require('../models/User');

const router = express.Router();



// * @route   GET  api/auth
// * @desc     Get logged in user information
// * @access  Private
router.get("/",  auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user)

    } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
    }
});



// * @route   Post  api/auth
// * @desc      Log in user &  issue token
// * @access  Public
router.post('/', [
    check("email", "email email is required").isEmail(),
    check("password", "password is required").exists()
],   
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password} = req.body;

    try {

        let user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({ msg: "user doesn't exists" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ msg: "invalid credentials" });
        }

        const payload = {
            user: {
              id: user.id,
            },
          };
    
          jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});




module.exports = router;