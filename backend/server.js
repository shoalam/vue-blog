import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.js";

const app = express();
dotenv.config();

const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/v1", userRoutes);
// Middleware for logging requests

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
