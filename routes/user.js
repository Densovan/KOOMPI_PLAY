const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const router = express.Router();
// const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../model/User");
const { TOKEN_SECRET } = process.env;

//Register
router.post(
  "/register",
  [
    check("name", "name is require")
      .not()
      .isEmpty(),
    check("email", "please input a valid email").isEmail(),
    check(
      "password",
      "please Enter a password with 6 or more character"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({ msg: "user already exist" });
      }
      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      res.status(400).json({ msg: "user has Created" });
      await user.save();
    } catch (error) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

//Longin
router.post(
  "/login",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "invalid Credentials..." });
      } else {
        const payload = {
          user: {
            id: user.id
          }
        };
        jwt.sign(payload, TOKEN_SECRET, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//Get Current user
router.get("/current", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Eror");
  }
});

module.exports = router;
