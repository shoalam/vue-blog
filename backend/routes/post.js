import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
} from "../controllers/postController.js";

const router = express.Router();

// GET endpoint for getting all products

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getSinglePost).delete(deletePost).put(updatePost);

export default router;
