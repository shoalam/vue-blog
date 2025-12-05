import express from "express";
import {
    getPostComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.route("/post/:postId").get(getPostComments).post(createComment);
router.route("/:id").put(updateComment).delete(deleteComment);
router.route("/:id/like").post(likeComment);

export default router;
