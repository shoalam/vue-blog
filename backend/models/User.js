import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow null values to be non-unique
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["author", "admin"],
      default: "author",
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
    // Keep old 'name' and 'image' for backward compatibility
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model("User", userSchema);
