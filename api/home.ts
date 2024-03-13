import { Request, Response } from "express";
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { InsertDatum, Inter, UpdateScore, Vote } from "../model/model";

export const router = express.Router();

router.get('/', (req, res) => {
    let sql = `SELECT ROW_NUMBER() OVER (ORDER BY score DESC) AS rank, image.*
    FROM
        image
    ORDER BY
        score DESC
    LIMIT
        10;`;

    conn.query(sql, (err, result) => {
        if (err) {
            console.error("ERROR! Jaaa");
            return res.status(500).json({ err: "Internet problem" });

        }
        if (!err) {
            // let sql = `SELECT * FROM image ORDER BY score DESC LIMIT 10`;
            res.json(result);
            console.log(result);
            
            // conn.query(sql, (err, top10Result)=>{
            //     if (err) {
            //         console.error("ERROR! Jaaa");
            //         return res.status(500).json({ err: "Internet problem" });
        
            //     }
            // })

        }
    })
});
