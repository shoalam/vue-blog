import express from "express";
import { userData } from "../controllers/userController.js";

const router = express.Router();

// GET endpoint for getting all products

router.get("/users", userData);
export default router;
