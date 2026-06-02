import express from 'express'
import cors from 'cors'
import logger from './middleware/logger.js'
import register from './routes/register.js'
import auth from './routes/auth.js'
import tasks from './routes/tasks.js'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFoundHandler.js'
import { corsOptions } from './config/corsOptions.js'
import { verifyJWT } from './middleware/verifyJWT.js'
import userExists from './middleware/userExists.js'
const PORT = process.env.PORT || 3000
const app = express()

app.use(cors(corsOptions))
//middleware for allowing all origins
//middleware for reading JSON data
app.use(express.json())

//middleware for console req coloring
app.use(logger)

app.use('/register', register)
app.use('/auth',auth)
app.use('/api/tasks/',verifyJWT,userExists,tasks) // need to add verifyJWT middleware too
app.use(notFound)
app.use(errorHandler)




app.listen(PORT,()=>console.log('Server running on PORT 3000'));