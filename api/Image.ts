import mysql from "mysql";
import express from "express";
// import bcryptt from "bcrypt";
import { Image, login, register } from "../model/model";
import { conn, queryAsync } from "../dbconnect";

export const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("GET IN Image.ts")
// })

router.get("/Search/:mid", (req, res) => {
    let mid = req.params.mid;

    let sql = "SELECT * FROM image where mid = ?"

    conn.query(sql , [mid], (err, result) => {
        if(err) {
            console.error("Error executing quert: ", err);
            return res.status(500).send({ error : "Internal Server Error" })
        }

        res.status(200).json(result[0]);
    })
})

router.get("/Check/:id", (req, res) => {
    let userId = req.params.id;

    let sql = "SELECT COUNT(*) FROM image , User where image.uid = User.uid and User.uid = ?";

    conn.query(sql, [userId], (err, result) => {
        if(err){
            console.error("Error executing quert: ", err);
            return res.status(500).send({ error : "Internal Server Error" })
        }

        res.status(200).json(result[0]);
    })
})

router.get("/:id", (req, res) => {
    let userId = req.params.id;

    let sql = "SELECT image.* FROM image , User where image.uid = User.uid and User.uid = ?";

    conn.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "Internal Server Error" });
        }

        res.status(200).json(results);
    });
});

router.post("/:id",async (req, res) => {
    let userId = req.params.id;
    const body: Image = req.body;

    let sqldelete = `DELETE FROM datum WHERE mid = ${body.mid}`;
    await queryAsync(sqldelete)

    let sql = "INSERT INTO `image`(`uid`, `name`, `image`, `score`) VALUES (?, ?, ?, ?)";

    sql = mysql.format(sql , [
        userId,
        body.name,
        body.image,
        1500,
        0,
    ])

    conn.query(sql, (err, result) => {
        if(err) {
            console.error("Error executing query: ", err);
            return res.status(500).send({ error : "Internal Server Error" })
        }

        res.status(200).json(result)
    })
})

router.delete("/:mid", (req, res) => {
    let mid = req.params.mid;
    
    let sql = "delete from image where mid = ?";

    conn.query(sql, [mid], (err, result) => {
        if(err) {
            console.error("Error executing query: ", err);
            return res.status(500).send({ error : "Internal Server Error" })
        }

        res.status(200).json(result)
    })
})

router.put("/Update/:mid", async (req, res) => {
    let mid = req.params.mid;
    let img: Image = req.body

    let sql = "select * from image where mid = ?";

    sql = mysql.format(sql , [mid])

    let result = await queryAsync(sql);

    sql = `DELETE FROM datum where mid = ${mid}`;
    await queryAsync(sql);

    const imgOrigin: Image = JSON.parse(JSON.stringify(result));

    const update = {...imgOrigin, ...img};

    sql = "UPDATE `image` SET `name`=?,`image`=?, `score`=? WHERE `mid` = ?";

    sql = mysql.format(sql , [
        update.name,
        update.image,
        1500,
        mid
    ]);

    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.status(200).json(result)
    })
})

router.get("/getScore/:mid" ,async (req , res) => {
    let mid = req.params.mid

    let sql = `SELECT mid , score
                from image
                where mid = ${mid}`;

    try {
        const result : any = await queryAsync(sql);

        if(result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(500).json({ error : "Error Image Not Found" })
        }
    } catch (error) {
        res.status(400).json({ error : "Error Query!!!" })
    }
})