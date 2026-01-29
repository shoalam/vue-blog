import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";
import multer from "multer";
import { storage } from "../helpers/MulterStorage.js";
import verifyToken from "../middlewares/verifyToken.js";

//get All Posts -- api/v1/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, tag } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  const posts = await Post.find(query)
    .populate("author", "firstName lastName username avatar")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Post.countDocuments(query);

  res.json({
    posts,
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / limit),
  });
});

//get single post -- api/v1/posts/:id
export const getSinglePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find and increment views
  const post = await Post.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("author", "firstName lastName username avatar")
    .populate("category", "name slug");

  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }
  res.json(post);
});

//storage

const upload = multer({ storage });

//create a new post - - api/v1/posts
export const createPost = [
  upload.single("image"),
  verifyToken,
  asyncHandler(async (req, res) => {
    const { title, description, content, category, tags, status } = req.body;
    const authorId = req.user.id; // From verifyToken middleware

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    } else if (!description) {
      return res.status(400).json({ message: "Description is required" });
    } else if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const post = await Post.create({
        title,
        description,
        content: content || "",
        category,
        author: authorId,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : [],
        status: status || "published",
        image: imageUrl,
      });

      if (!post) {
        return res.status(400).json({ message: "Failed to create post" });
      }

      await post.populate("author", "firstName lastName username avatar");
      await post.populate("category", "name slug");

      res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }),
];

//delete post - api/v1/posts/:id
export const deletePost = [
  verifyToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }

    // Check authorization: author or admin
    //const isAuthor = post.author && String(post.author) === String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to perform this operation on this post",
        debug: {
          postAuthor: post.author,
          userId: req.user.id,
          userRole: req.user.role
        }
      });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully", post });
  }),
];

//update post - api/v1/posts/:id
export const updatePost = [
  upload.single("image"),
  verifyToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, content, category, tags, status, image } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check authorization: author or admin
    const isAuthor = post.author && String(post.author) === String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to update this post" });
    }

    // Handle new image upload
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : image; // Keep existing image if no new upload

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        description,
        content: content || post.content,
        category,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : post.tags,
        status: status || post.status,
        image: imageUrl,
      },
      { new: true }
    ).populate("author", "firstName lastName username avatar")
      .populate("category", "name slug");

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  }),
];

