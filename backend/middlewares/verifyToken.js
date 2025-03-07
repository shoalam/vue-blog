import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized Access" });

  const realToken = token.split(" ")[1];

  try {
    const verified = jwt.verify(realToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default verifyToken;
