
import {Router} from 'express'
import {auth } from '../helper/auth.js'
import {getTasks, postTasks} from '../controllers/taskController.js'


const router = Router()

router.get('/tasks',  getTasks)

router.post('/tasks', auth, postTasks)


export default router