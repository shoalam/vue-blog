import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  } else if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const loggedInUser = await User.findOne({ email });

  if (!loggedInUser) {
    return res.status(401).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    loggedInUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    {
      email: loggedInUser.email,
      password: loggedInUser.password,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
  );

  res.cookie("accessToken", token);

  res.status(200).json({ message: "Login successful", token, loggedInUser });
});
