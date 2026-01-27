import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser);
router.route("/profile/:id").put(updateProfile);
router.route("/change-password/:id").post(changePassword);

export default router;

