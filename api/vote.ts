import { Request, Response } from "express";
import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { UpdateScore } from "../model/model";

export const router = express.Router();

router.get("/random", (req, res) => {
    const getRandomImages = () => {
        let random = "SELECT * FROM image ORDER BY RAND() LIMIT 2;";

        conn.query(random, (err, result) => {
            if (err) {
                res.status(500).json({ error: "Internal Server Error" });
                throw err;
            }

            if (result[0].uid !== result[1].uid) {
                res.json(result);
            } else {
                getRandomImages();
            }
        });
    };

    getRandomImages();
});

router.put("/random", (req, res) => {

    const data: UpdateScore = req.body 

    let sql = "UPDATE `image` SET `score`= ? where mid = ?"

    sql = mysql.format(sql, [ 
        data.score,
        data.mid
    ])

    conn.query(sql, (err, result)=>{
        if(err){
            console.log(err);
        }
        res.json(result);

    });

});



export default router;