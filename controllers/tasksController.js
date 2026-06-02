import tasksData from "../models/tasksData.json" with { type: "json" };
import path from "path";
import url from "url";
import fs from "fs";

let tasks = tasksData;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function writeTasks(tasks = []) {
  await fs.promises.writeFile(
    path.join(__dirname, "..", "models", "tasksData.json"),
    JSON.stringify(tasks),
  );
}

// @ GET http://localhost:3000/api/tasks/show
export function handleDisplay(req, res, next) {
  try{
const userId = req.userId; //Change back
  const userTasks = tasks[userId] || [];
  if (userTasks.length === 0) {
    return res.status(200).json([]);
  }
  res.status(200).json(userTasks);
  }
  catch(error){
    console.log(error)
    next(error)
  }
}

// @ POST http://localhost:3000/api/tasks/add
export async function handleAdd(req, res, next) {
  try {
    const userId = req.userId; //ChangeBack
    const newTask = req.body;
    const userTasks = tasks[userId] || [];
    const dupliCheck = userTasks.find((task) => task.taskId === newTask.taskId);
    if (dupliCheck)
      return next({ status: 409, message: "Task already exists" });
    userTasks.push(newTask);
    tasks[userId] = userTasks;
    await writeTasks(tasks);
    res.status(201).json({ success: `new task ${newTask.taskId} created` });
  } catch (err) {
    next(err);
  }
}

// @ DELETE http://localhost:3000/api/tasks/remove/:id
export async function handleRemove(req, res, next) {
  try {
    const userId = req.userId; //change back
    const removeTaskId = req.params.id;
    console.log(removeTaskId)
    const userTasks = tasks[userId] || [];
    if (userTasks.length === 0)
      return next({ status: 409, message: "Task not found" });
    const taskExists = userTasks.some((task) => task.taskId === removeTaskId);
    if (!taskExists) return next({ status: 404, message: "Task not found" });
    const delTasks = userTasks.filter((task) => task.taskId !== removeTaskId);
    tasks[userId] = delTasks;
    await writeTasks(tasks);
    res.status(200).json({success: true});
  } catch (error) {
    next(error);
  }
}

export async function handleUpdate(req, res, next) {
  try {
    const userId = req.userId; //change back
    const updateTask = req.body;
    const userTasks = tasks[userId] || [];
    if (userTasks.length === 0)
      return next({ status: 409, message: "Task not found" });
    const index = userTasks.findIndex((t) => t.taskId === updateTask.taskId);
    if (!index && index != 0)
      return next({ status: 409, message: "Task not found" });
    userTasks[index] = updateTask;
    tasks[userId] = userTasks;
    await writeTasks(tasks);
    res.status(200).json(updateTask);
  } catch (error) {
    next(error);
  }
}

export async function handleToggle(req, res, next) {
  try {
    const userId = req.userId; //change back
    const completeTaskId = req.params.id;
    console.log(completeTaskId)
    const status = req.body;
    console.log(status)
    const userTasks = tasks[userId] || [];
    if (userTasks.length === 0)
      return next({ status: 409, message: "Task not found" });
    const oldTask = userTasks.find((t) => t.taskId === completeTaskId);
    console.log(oldTask)
    const index = userTasks.findIndex((t) => t.taskId === completeTaskId);
    if (!oldTask) return next({ status: 409, message: "Task not found" });

    userTasks[index] = { ...oldTask, ...status };
    tasks[userId] = userTasks;
    await writeTasks(tasks);
    res.status(200).json({success: true})
  } catch (error) {
    console.log(error);
    next(error);
  }
}
