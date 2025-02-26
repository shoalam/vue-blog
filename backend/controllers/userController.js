import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";

//get All Users -- api/v1/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "No users found" });
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
  const { name, email, phone, password, gender, age, photo, status, trash } =
    req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (!name || !email || !password || !gender || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    gender,
    age,
    photo,
    status,
    trash,
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
  const { name, email, phone, password, gender, age, photo, status, trash } =
    req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email can not be updated" });
  }
  if (!name || !gender || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      phone,
      gender,
      age,
      photo,
      status,
      trash,
    },
    { new: true }
  );

  res.status(200).json({ message: "user updated successfully", updatedUser });
});
