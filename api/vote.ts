import { Request, Response } from "express";
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { InsertDatum, Inter, UpdateScore, Vote } from "../model/model";

export const router = express.Router();

let number: number[] = [];
let length: number;

router.get("/random", (req, res) => {
    let sql = `SELECT * FROM image`;

    conn.query(sql, (err, result) => {
        if (err) {
            console.error("ERROR!");
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const remainingRecords = result.filter((record: { mid: number; }) => !number.includes(record.mid));
        length = remainingRecords.length;

        if (length > 1) {
            const getRandomImages = () => {
                let randomSql = "SELECT * FROM image ORDER BY RAND() LIMIT 2";

                if (number.length > 0) {
                    randomSql = `SELECT * FROM image WHERE mid NOT IN (${number.join(',')}) ORDER BY RAND() LIMIT 2`;
                }

                conn.query(randomSql, (err, randomResult) => {
                    if (err) {
                        res.status(500).json({ error: "Internal Server Error" });
                        return;
                    }

                    if (!randomResult[0].uid || !randomResult[1].uid) {
                        res.status(200).json(false);
                        number = [];
                        return;
                    }

                    if (randomResult[0].uid !== randomResult[1].uid) {
                        length = remainingRecords.length - 2;
                        randomResult.forEach((result: { mid: number; }) => {
                            number.push(result.mid);
                        });

                        res.json(randomResult);
                    } else {
                        getRandomImages();
                    }
                });
            };
            getRandomImages();
        } else {
            res.status(200).json(false);
            number = [];
        }
    });
});

router.put("/updatescore", (req, res) => {
    const data: UpdateScore = req.body;

    const sql = "UPDATE `image` SET `score` = ? WHERE `mid` = ?";
    const values = [data.score, data.mid];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating score:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.json(result);
        }
    });
});

router.post("/InsertWinnerLoser", async (req, res) => {
    const data: Vote = req.body;
    const currentTime = new Date();
    let sql;

    try {

        const winnerQuery = `SELECT * FROM image WHERE mid = ${data.winner}`;
        const loserQuery = `SELECT * FROM image WHERE mid = ${data.loser}`;

        const winnerResult: any = await queryAsync(winnerQuery);
        const loserResult: any = await queryAsync(loserQuery);

        if (winnerResult.length === 0 || loserResult.length === 0) {
            return res.status(400).json({ error: "Winner or loser not found" });
        }

        sql = `INSERT INTO vote (uid ,winner, loser, date) VALUES (?, ?, ?, ?)`;
        sql = mysql.format(sql, [data.uid, data.winner, data.loser, currentTime]);

        const insertResult = await queryAsync(sql) as Inter;

        if (insertResult.affectedRows > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ error: "Error inserting into vote table" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/InsertVote", (req, res) => {
    const data: InsertDatum = req.body;
    let sql;
    let currentTime = new Date();

    sql = `SELECT * FROM image where mid = ${data.mid}`;

    conn.query(sql, async (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error!" })
        }

        if (result.length > 0) {
            try {

                sql = `SELECT *
                        FROM datum
                        WHERE mid = ${data.mid} AND DATE(date) = CURDATE()
                        GROUP BY mid`;

                const resultDatum: any = await queryAsync(sql);

                if (resultDatum.length === 0) {
                    sql = `INSERT INTO datum(mid, score, date) VALUES (?, ?, ?)`;
                    sql = mysql.format(sql, [data.mid, data.score, currentTime]);
                } else {
                    sql = `UPDATE datum 
                            set score = ?,
                            date = ?
                            where mid = ?
                            AND DATE(date) = CURDATE()`;
                    sql = mysql.format(sql, [data.score, currentTime, data.mid])
                }
                
                const result = await queryAsync(sql);
                res.status(200).json({ success: true, result: result });

            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Error Query!" });
            }

        } else {
            res.status(500).json({ error: "Error Image ID Not Found!!" })
        }
    })
});

// เอาข้อมูลล่าสุด
router.get("/Graph/:uid", async (req, res) => {
    let sql;
    const uid = req.params.uid

    sql = `SELECT datum.mid, datum.score, DATE_FORMAT(datum.date, '%Y-%m-%d %H:%i:%s') AS date, image.score AS m_score , image.image as url
    FROM datum
    JOIN image ON datum.mid = image.mid 
    WHERE image.uid = ${uid}
    AND datum.date >= CURDATE() - INTERVAL 6 DAY
    AND datum.date < CURDATE() + INTERVAL 1 DAY
    ORDER BY datum.date`;
    
    try {
        const result : any = await queryAsync(sql!);

        if (result.length > 0){
            res.status(200).json(result)
        } else {
            res.status(400).json({ error : "Error Result = []" })
        }
    } catch (error) {
        res.status(500).json({ error: "Error Query!" })
    }
})