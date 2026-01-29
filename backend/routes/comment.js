import express from "express";
import {
    getPostComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
} from "../controllers/commentController.js";

import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/post/:postId").get(getPostComments).post(verifyToken, createComment);
router.route("/:id").put(verifyToken, updateComment).delete(verifyToken, deleteComment);
router.route("/:id/like").post(verifyToken, likeComment);

export default router;
