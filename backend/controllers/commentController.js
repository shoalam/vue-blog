import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";

//get comments for a post -- api/v1/comments/post/:postId
export const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId, parentComment: null })
        .populate("author", "firstName lastName username avatar")
        .populate({
            path: "post",
            select: "title",
        })
        .sort({ createdAt: -1 });

    res.json(comments);
});

//create a new comment - api/v1/comments/post/:postId
export const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, parentComment } = req.body;
    const authorId = req.user?.id || req.body.authorId; // Get from auth or body for testing

    if (!content) {
        return res.status(400).json({ message: "Comment content is required" });
    }

    if (!authorId) {
        return res.status(401).json({ message: "User must be authenticated" });
    }

    const comment = await Comment.create({
        post: postId,
        author: authorId,
        content,
        parentComment: parentComment || null,
    });

    if (!comment) {
        return res.status(400).json({ message: "Failed to create comment" });
    }

    // Populate author info before sending response
    await comment.populate("author", "firstName lastName username avatar");

    res.status(201).json({ message: "Comment created successfully", comment });
});

//update comment - api/v1/comments/:id
export const updateComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id || req.body.userId; // Get from auth or body for testing

    if (!content) {
        return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: "You can only edit your own comments" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
});

//delete comment - api/v1/comments/:id
export const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId; // Get from auth or body for testing

    const comment = await Comment.findById(id);

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment deleted successfully" });
});

//like/unlike comment - api/v1/comments/:id/like
export const likeComment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Simple increment - in production, track who liked
    comment.likes += 1;
    await comment.save();

    res.status(200).json({ message: "Comment liked", likes: comment.likes });
});
