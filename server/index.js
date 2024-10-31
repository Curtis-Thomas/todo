import express from "express";
import cors from "cors";
import pkg from "pg";

import dotenv from "dotenv";

import {pool} from './helper/bd.js'

import todoRouter from './routes/todoRouter.js'

const port = process.env.PORT




const app = express();

app.use((err,req,res,next) =>{
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({error: err.message})
})



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter)









app.listen(port);
