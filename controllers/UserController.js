const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");
require("dotenv").config();

const userController = express.Router();

userController.post("/signup", async (req, res) => {
  const { email, name, password, role } = req.body;
  if (!(email && password && name && role)) {
    return res.status(400).json({ message: "Please fill all the details" });
  }

  try {
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "User already exists. Please login!",
      });
    }

    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      const user = await UserModel.create({
        ...req.body,
        role: role,
        password: hash,
      });
      res.json({ message: "User signed up successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({ message: "Please fill all the details" });
  }

  try {
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      return res.status(400).json({
        message: "User does not exist. Please Signup!",
      });
    }

    bcrypt.compare(password, userExist.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          { role: userExist.role, userId: userExist._id },
          process.env.JWT_SECRET
        );
        return res.json({
          message: "login succcessful",
          userData: {
            token: token,
            name: userExist.name,
            role: userExist.role,
          },
        });
      } else {
        return res.status(400).json({
          message: "Wrong credentials!",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { userController };
