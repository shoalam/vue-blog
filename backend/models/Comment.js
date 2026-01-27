import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            trim: true,
            required: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Comment", commentSchema);
