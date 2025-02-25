import asyncHandler from "express-async-handler";

export const userData = asyncHandler(async (req, res) => {
  res.json({
    name: "John Doe",
    age: 30,
    email: "johndoe@example.com",
  });
});
