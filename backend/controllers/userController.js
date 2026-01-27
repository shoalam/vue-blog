import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";

//get All Users -- api/v1/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "No user found" });
  }
  res.json(users);
});

//get single user -- api/v1/users/:id

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "No users found" });
  }
  res.json(user);
});

//create a new user - - api/v1/users

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, image } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  } else if (!email) {
    return res.status(400).json({ message: "Email is required" });
  } else if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    image,
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid user data" });
  }

  res.status(201).json({ message: "User created successfully", user });
});

//delete user - api/v1/users/:id

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json({ message: "user deleted successfully", user });
});

//update user - api/v1/users/:id

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, image } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email can not be updated" });
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      role,
      image,
    },
    { new: true }
  );

  res.status(200).json({ message: "user updated successfully", updatedUser });
});

//update profile - api/v1/users/profile/:id
export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, username, bio, avatar } = req.body;

  if (!firstName) {
    return res.status(400).json({ message: "First name is required" });
  } else if (!lastName) {
    return res.status(400).json({ message: "Last name is required" });
  }

  // Check username uniqueness if being updated
  if (username) {
    const existingUsername = await User.findOne({
      username,
      _id: { $ne: id } // Exclude current user
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      username,
      bio,
      avatar,
      name: `${firstName} ${lastName}`, // Update name for backward compatibility
    },
    { new: true }
  ).select("-password"); // Don't return password

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
});

//change password - api/v1/users/change-password/:id
export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: "Current password is required" });
  } else if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  } else if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  // Get user with password
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Verify current password
  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

