const express = require("express");
const jwt = require("jsonwebtoken");
const { add, get } = require("../data/user");
const { NotFoundError } = require("../util/errors");
const bcrypt = require("bcryptjs");
const { isValidEmail, isValidPassword } = require("../util/validation");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const data = req.body;
  let errors = {};
  if (!isValidEmail) {
    errors.email = "Invalid Email";
  } else {
    try {
      const exists = await get(data.email);
      if (exists) {
        errors.email = "Email already exists";
      }
    } catch (err) {}
  }

  if (!isValidPassword(data.password)) {
    errors.password = "Enter a password having minimum length of 6";
  }

  if (Object.values(errors).length > 0) {
    return res.status(422).json({ message: "Authentication failed", errors });
  }

  try {
    const user = await add(data);
    const authToken = jwt.sign({ email: data.email }, "superstrongkey", {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "SignUp successful",
      userId: user.id,
      token: authToken,
    });
  } catch (err) {
    console.log(err);
    return next(new NotFoundError("Authentication failed"));
  }
});

router.post("/login", async (req, res, next) => {
  const data = req.body;
  let user;
  let errors = {};
  if (!isValidEmail(data.email)) {
    errors.email = "Not a valid email";
  } else {
    try {
      user = await get(data.email);
      if (!user) {
        errors.email = "No user registered with this email";
      }
      
    } catch (err) {
      next(err);
    }
  }
  if (!isValidPassword(data.password)) {
    errors.password = "Enter a valid password";
  } else {
    if (user) {
      const passMatch = await bcrypt.compare(data.password, user.password);
      if (!passMatch) {
        errors.password = "Password does not match";
      } else {
        const authToken = jwt.sign({ email: data.email }, "superstrongkey", {
          expiresIn: "1h",
        });
        return res
          .status(201)
          .json({ message: "Authentication successful", token: authToken });
      }
    }
  }

  if (Object.values(errors).length > 0) {
    return res.status(422).json({ message: "Validation failed", errors });
  }
});

module.exports = router;
