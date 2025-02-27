import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// GET endpoint for getting all products

router.route("/login").post(login);

export default router;
