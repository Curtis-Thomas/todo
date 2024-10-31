import { pool } from "../helper/bd.js";
import { Router } from "express";
import { emptyOrRows } from "../helper/utils.js";
import {auth} from'../helper/auth.js'


const router = Router();

router.get("/", (req, res) => {
//   console.log("Received GET request at /");
//   console.log("Request headers:", req.headers);
//   console.log("Request query parameters:", req.query);

  pool.query("SELECT * from task", (error, result) => {
    if (error) {
      console.error("Error executing query", error.stack);
      return res.status(500).json({ error: error.message });
    }
    console.log("Query executed successfully");
    // console.log("Query result:", result.rows);
    return res.status(200).json(emptyOrRows(result));
  });
});

router.post("/create", auth, (req, res) => {
  if (!req.body.description || req.body.description.length === 0) {
    return res.status(400).json({ error: "Invalid description" });
  }

  pool.query(
    "insert into task (description) values ($1) returning *",
    [req.body.description],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ id: result.rows[0].id });
    }
  );
});

router.delete("/delete/:id", auth,(req, res) => {
  const id = parseInt(req.params.id);

  pool.query("delete from task where id = $1", [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ id: id });
  });
});

export default router;
