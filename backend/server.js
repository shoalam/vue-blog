import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { mongoDBConnect } from "./config/db.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// users routes
app.use("/api/v1/users", userRoutes);

// auth routes
app.use("/api/v1/auth", authRoutes);

//post routes
app.use("/api/v1/posts", postRoutes);

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  mongoDBConnect();
  console.log(`Server is listening on ${PORT}`);
});
