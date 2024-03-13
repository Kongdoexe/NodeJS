import mysql from "mysql";
import express from "express";
import multer from "multer";
import path from "path";
import { conn, queryAsync } from "../dbconnect";

export const router = express.Router();

let fileUpload

// router.get("/", (req, res) => {
//     let uid = req.query.id;

//     let sql = "SELECT * FROM User where uid = ?"

//     conn.query(sql, [uid], (err, results) => {
//         if (err) {
//             console.error("Error executing query:", err);
//             return res.status(500).send({ error: "Internal Server Error" });
//         }

//         res.status(200).json(results);
//     });
// });

router.get("/:id", (req, res) => {
    let userId = req.params.id;

    let sql = "SELECT * FROM User where uid = ?";

    conn.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "Internal Server Error" });
        }

        console.log(results);
        res.status(200).json(results);

        
    });
});