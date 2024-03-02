import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";

export const router = express.Router();

router.get("/:id", (req, res) => {
  // res.send("Hello world");
  const id = req.params.id;
  const sql = "SELECT * FROM User where uid = ?";
  conn.query(sql, [id] ,(error, results) => {
    if (error) throw error;

    res.send(results);
  });
});
