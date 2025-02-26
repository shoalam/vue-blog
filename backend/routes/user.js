import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

// GET endpoint for getting all products

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser);
export default router;
