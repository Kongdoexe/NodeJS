import { Request, Response } from "express";
import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { UpdateScore } from "../model/model";

export const router = express.Router();


router.get("/random", (req, res) => {
    let check: number[] = []
    let sql = `SELECT * FROM image`;
    
    conn.query(sql, (err, result) => {
        if (err) {
            console.error("ERROR!");
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const getRandomImages = () => {
            let randomSql = "SELECT * FROM image ORDER BY RAND() LIMIT 2";

            conn.query(randomSql, (err, randomResult) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                const [image1, image2] = randomResult;

                check.push(randomResult.mid)

                console.log(check);
                

                if (image1.uid !== image2.uid) {
                    res.json(randomResult);
                } else {
                    getRandomImages();
                }
            });
        };

        getRandomImages();
    });
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