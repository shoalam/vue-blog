import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";
import multer from "multer";
import { storage } from "../helpers/MulterStorage.js";
import verifyToken from "../middlewares/verifyToken.js";

//get All Users -- api/v1/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();

  if (posts.length === 0) {
    return res.status(404).json({ message: "No post found" });
  }
  res.json(posts);
});

//get single user -- api/v1/posts/:id

export const getSinglePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }
  res.json(post);
});

//storage

const upload = multer({ storage });

//create a new user - - api/v1/posts

export const createPost = [
  upload.single("image"),
  verifyToken,
  asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    } else if (!description) {
      return res.status(400).json({ message: "Description is required" });
    } else if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // // If an image is uploaded, it should be in req.file
    // let imageUrl = "";
    // if (req.file) {
    //   // You can store the image URL or path in your database
    //   imageUrl = req.file.path; // This assumes Multer is saving the image and providing a path
    // } else {
    //   return res.status(400).json({ message: "Image is required" });
    // }

    const imageUrl = req.file ? `/public/uploads/${req.file.filename}` : null;

    try {
      // Create the post with the provided data and image URL
      const post = await Post.create({
        title,
        description,
        category,
        image: imageUrl, // Save the image path in the database
      });

      if (!post) {
        return res.status(400).json({ message: "Failed to create post" });
      }

      res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }),
];

//delete user - api/v1/users/:id

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }
  res.status(200).json({ message: "Post deleted successfully", post });
});

//update user - api/v1/users/:id

export const updatePost = [
  verifyToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, category, image } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    } else if (!description) {
      return res.status(400).json({ message: "Description is required" });
    } else if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const updatedPost = await User.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        image,
      },
      { new: true }
    );

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  }),
];
