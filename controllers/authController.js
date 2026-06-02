import usersData from "../models/users.json" with { type: "json" };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import fs from "fs";
import path from "path";
import url from 'url';
let users = [...usersData]
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function handleLogin(req, res, next) {
  try {
    const { user, pwd } = req.body;
    if (!user || !pwd)
      return next({ status: 400, message: "Username and password are required" });
    const foundUser = users.find((person) => person.username === user);
    if (!foundUser) return next({ status: 404, message: "User not found" }); //unauthorized

    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      //create JWTs
      const accessToken = jwt.sign(
        { userId: foundUser.userId},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" },
      );
      const refreshToken = jwt.sign(
        { userId: foundUser.userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" },
      );

      //saving refreshToken with current user - for log out before expiry
      const otherUsers = users.filter(
        (person) => person.username !== foundUser.username,
      );
      const currentUser = { ...foundUser, refreshToken: refreshToken };
      users = [...otherUsers, currentUser];
      await fs.promises.writeFile(
        path.join(__dirname, "..", "models", "users.json"),
        JSON.stringify(users),
      );
      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      return next({ status: 401, message: "Invalid password" });
    }
  } catch (error) {
    next(error);
  }
}
