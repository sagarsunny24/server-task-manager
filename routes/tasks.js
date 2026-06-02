import express from 'express'
import { handleAdd,handleDisplay,handleRemove,handleToggle,handleUpdate } from '../controllers/tasksController.js'
const router = express.Router()



router.post('/add',handleAdd)
router.delete('/remove/:id', handleRemove)
router.put('/update', handleUpdate)
router.get('/show', handleDisplay)
router.patch('/mark/:id',handleToggle)


export default router;