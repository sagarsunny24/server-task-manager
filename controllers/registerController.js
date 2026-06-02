import users from "../models/users.json" with { type: "json" };
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import url from 'url'
import crypto from 'crypto'
import tasksData from '../models/tasksData.json' with { type: 'json'}

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function registerUser(req, res,next) {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return next({
      status:400,
      message: "Username and password are required" });
  //check for duplicate usernames in the db
  const duplicate = users.find((person) => person.username === user);
  if (duplicate) return next({
      status:409,
      message: "User already exists" });
  try {
    //encrypt the password
    const hashedPswrd = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashedPswrd, userId: crypto.randomBytes(5).toString('hex')};

    //adding to json
    users.push(newUser);
    tasksData[newUser.userId] = []
    await fs.promises.writeFile(
      path.join(__dirname, '..','models', 'users.json'),
      JSON.stringify(users)
    )
     await fs.promises.writeFile(
      path.join(__dirname, '..','models', 'tasksData.json'),
      JSON.stringify(tasksData)
    )
    console.log(users)


    res.status(201).json({'success': `new user ${user} created`});
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
 