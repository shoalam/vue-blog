import multer from "multer";
import path from "path";
import fs from "fs";

//folder creation
// const uploadsDir = path.resolve(
//   new URL(import.meta.url).pathname.substring(8),
//   "../../public/uploads"
// );

// // Folder creation with error handling
// if (!fs.existsSync(uploadsDir)) {
//   try {
//     fs.mkdirSync(, { recursive: true });
//   } catch (error) {
//     console.error("Error creating uploads directory:", error);
//     throw new Error("Failed to create upload directory");
//   }
// }

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
