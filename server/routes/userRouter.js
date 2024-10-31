// routes/userRouter.js
import express from 'express';
import { postRegistration, postLogin } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', postRegistration);
router.post('/login', postLogin);

export default router;
