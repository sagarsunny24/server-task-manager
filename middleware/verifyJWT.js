import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next({ status: 401, message: "Unauthorized access" });
  console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return next({ status: 403, message: "Invalid Access" });
    req.userId = decoded.userId;
    next();
  });
};
