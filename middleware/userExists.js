import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../models/tasksData.json");

export default function userExists(req, res, next) {
  const userId = req.userId; //change it back to req.userId
  const tasks = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!Object.hasOwn(tasks, userId))
    return next({ status: 404, message: "User does not have any tasks" });
  next();
}
