
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log(req.headers.authorization);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains userId & role

    //   req.user = {
    //   id: decoded.userId,
    //   role: decoded.role,
    // };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
