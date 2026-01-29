import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    excerpt: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make optional for backward compatibility
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow null values
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before saving
postSchema.pre("save", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  // Set excerpt from description if not provided
  if (this.description && !this.excerpt) {
    this.excerpt = this.description.substring(0, 150);
  }

  next();
});

export default mongoose.model("Post", postSchema);
