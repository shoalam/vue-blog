import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import categoryRoutes from "./routes/category.js";
import commentRoutes from "./routes/comment.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { mongoDBConnect } from "./config/db.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to the Blog API");
});

// users routes
app.use("/api/v1/users", userRoutes);

// auth routes
app.use("/api/v1/auth", authRoutes);

//post routes
app.use("/api/v1/posts", postRoutes);

//category routes
app.use("/api/v1/categories", categoryRoutes);

//comment routes
app.use("/api/v1/comments", commentRoutes);

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  mongoDBConnect();
  console.log(`Server is listening on ${PORT}`);
});

