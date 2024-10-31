// index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import todoRouter from './routes/todoRouter.js';
import userRouter from './routes/userRouter.js';
import taskRoutes from './routes/taskRouter.js';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', todoRouter);
app.use('/user', userRouter);
app.use('/api', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(err.statusCode || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            code: err.code || 'UNKNOWN_ERROR'
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
