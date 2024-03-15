import { Request, Response } from "express";
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { InsertDatum, Inter, UpdateScore, Vote } from "../model/model";

export const router = express.Router();

router.get('/', (req, res) => {
    let sqlImages = `
        SELECT ROW_NUMBER() OVER (ORDER BY image.score DESC) AS rank, image.*, datum.score AS datum_score
        FROM image
        LEFT JOIN datum ON image.mid = datum.mid
        WHERE DATE(datum.date) = CURDATE() - INTERVAL 1 DAY
        ORDER BY image.score DESC
        LIMIT 10
    `;

    conn.query(sqlImages, (err, imageResult) => {
        if (err) {
            console.error("ERROR fetching images:", err);
            return res.status(500).json({ err: "Error fetching images" });
        }

        if (imageResult.length > 0) {
            for (let i = 0; i < imageResult.length; i++) {

                let changeMessage;
                if (imageResult[i].score > imageResult[i].datum_score) {
                    // "Score Up"
                    changeMessage = 1;
                } else if (imageResult[i].score < imageResult[i].datum_score) {
                    // "Score Down"
                    changeMessage = 2;
                } else {
                    // "Score remains the same"
                    changeMessage = 0;
                }

                // Add changeMessage property to each image object
                imageResult[i].changeMessage = changeMessage;
            }

            // Prepare response data
            const responseData = {
                images: imageResult,
            };

            // Send response
            res.json(responseData);
            console.log(responseData);
        } else {
            console.log("No images found");
            res.status(404).json({ message: "No images found" });
        }
    });
})






// router.get('/', (req, res) => {
//     let sqlImages = `
//         SELECT ROW_NUMBER() OVER (ORDER BY score DESC) AS rank, image.*
//         FROM image
//         ORDER BY score DESC
//         LIMIT 10
//     `;

//     conn.query(sqlImages, (err, imageResult) => {
//         if (err) {
//             console.error("ERROR fetching images:", err);
//             return res.status(500).json({ err: "Error fetching images" });
//         }

//         let sqlData = `SELECT * FROM datum WHERE DATE(date) = CURRENT_DATE();`;

//         conn.query(sqlData, (err, dataDate) => {
//             if (err) {
//                 console.error("ERROR fetching data today:", err);
//                 return res.status(500).json({ err: "Error fetching data today" });
//             }

//             const responseData = {
//                 images: imageResult,
//                 dataToday: dataDate,
//             };

//             res.json(responseData);
//             console.log(responseData);

//         });
//     });



// });
