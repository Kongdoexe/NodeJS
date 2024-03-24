import mysql from "mysql";
import express from "express";
import { conn } from "../dbconnect";

export const router = express.Router();

router.get('/:uid', (req, res) => {
    const uid = req.params.uid;

    const sqlUser = `
        SELECT *
        FROM User
        WHERE uid = ?
    `;

    // const sqlImage = `
    //     SELECT *
    //     FROM image
    //     WHERE uid = ?
    // `;

    const formattedUser = mysql.format(sqlUser, [uid]);
    // const formattedImage = mysql.format(sqlImage, [uid]);

    conn.query(formattedUser, (err, resultUser) => {
        if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).send({ error: "Internal Server Error" });
        }

        // conn.query(formattedImage, (err, resultImage) => {
        //     if (err) {
        //         console.error("Error executing query: ", err);
        //         return res.status(500).send({ error: "Internal Server Error" });
        //     }

        //     const allImages = {
        //         imagesToday: resultUser, resultImage
        //         // imagesYesterday: yesterdayResult
        //     };
            

        // });
        res.status(200).json(resultUser);
    });
});
