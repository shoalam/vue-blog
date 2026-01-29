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
      id: loggedInUser._id,
      email: loggedInUser.email,
      role: loggedInUser.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
  );

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: loggedInUser._id,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      email: loggedInUser.email,
      role: loggedInUser.role,
      username: loggedInUser.username,
      avatar: loggedInUser.avatar,
    }
  });
});

//register
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  // Validation
  if (!firstName) {
    return res.status(400).json({ message: "First name is required" });
  } else if (!lastName) {
    return res.status(400).json({ message: "Last name is required" });
  } else if (!email) {
    return res.status(400).json({ message: "Email is required" });
  } else if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists with this email" });
  }

  // Check username uniqueness if provided
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    username: username || null,
    name: `${firstName} ${lastName}`, // For backward compatibility
  });

  if (!newUser) {
    return res.status(400).json({ message: "Failed to create user" });
  }

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username,
    }
  });
});

//logout

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken").json({ message: "Successfully logged out" });
});

