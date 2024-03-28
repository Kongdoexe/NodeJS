import { Request, Response } from "express";
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { InsertDatum, Inter, UpdateScore, Vote } from "../model/model";

export const router = express.Router();


router.get('/', async (req, res) => {

    let sqlDatum = `SELECT mid FROM datum`;
    const result: any = await queryAsync(sqlDatum);

    const mids = result.map((row: { mid: any; }) => row.mid).join(',');

    let sqlImagesToday = `
        SELECT ROW_NUMBER() OVER (ORDER BY image.score DESC) AS rank, image.*, datum.score AS datum_score
        FROM image
        LEFT JOIN datum ON image.mid = datum.mid
        WHERE DATE(datum.date) = CURDATE()
        ORDER BY image.score DESC
    `;

    let sqlImagesYesterday = `
        SELECT ROW_NUMBER() OVER (ORDER BY datum.score DESC) AS rank_yesterday, image.*, datum.score AS datum_score
        FROM image
        LEFT JOIN datum ON image.mid = datum.mid
        WHERE DATE(datum.date) = CURDATE() - INTERVAL 1 DAY
        ORDER BY datum.score DESC
    `;

    conn.query(sqlImagesToday, (err, todayResult) => {
        if (err) {
            console.error("ERROR fetching images today:", err);
            return res.status(500).json({ err: "Error fetching images today" });
        }

        conn.query(sqlImagesYesterday, (err, yesterdayResult) => {
            if (err) {
                console.error("ERROR fetching images yesterday:", err);
                return res.status(500).json({ err: "Error fetching images yesterday" });
            }

            // Check if results are not empty
            if (todayResult.length > 0 && yesterdayResult.length > 0) {
                // Loop through images today
                for (let i = 0; i < todayResult.length; i++) {
                    let changeMessage;
                    let resultRank;
                    // Find corresponding image from yesterday
                    const yesterdayImage = yesterdayResult.find((image: { mid: any; }) => image.mid === todayResult[i].mid);
                    if (yesterdayImage) {

                        // Compare ranks
                        if (todayResult[i].rank < yesterdayImage.rank_yesterday) {
                            // "Score Up"
                            // changeMessage = "Score Up";
                            changeMessage = 1;
                            resultRank = yesterdayImage.rank_yesterday - todayResult[i].rank

                        } else if (todayResult[i].rank > yesterdayImage.rank_yesterday) {
                            // "Score Down"
                            // resultRank = yesterdayImage.rank_yesterday - todayResult[i].rank
                            changeMessage = 2;
                            resultRank = todayResult[i].rank - yesterdayImage.rank_yesterday
                            // changeMessage = "Score Down";

                        } else {
                            // "Score remains the same"
                            resultRank = todayResult[i].rank
                            changeMessage = 0;
                            // changeMessage = "Score remains the same";
                        }
                        // Assign changeMessage to both today and yesterday images
                        todayResult[i].resultRank = resultRank;
                        todayResult[i].changeMessage = changeMessage;
                        // yesterdayImage.changeMessage = changeMessage;
                    }

                }
                // Prepare response data
                const responseData = {
                    imagesToday: todayResult,
                    // imagesYesterday: yesterdayResult
                };
                // Send response
                res.status(200).json(responseData);
            } else {
                let sqlall = `
                    SELECT ROW_NUMBER() OVER (ORDER BY image.score DESC) AS rank, image.* 
                    FROM image
                    ORDER BY image.score DESC
                `;

                conn.query(sqlall, (err, allImages) => {
                    if (err) {
                        console.error("ERROR fetching all images:", err);
                        return res.status(500).json({ err: "Error fetching all images" });
                    }

                    // Loop through all images and set changeMessage to 0
                    for (let i = 0; i < allImages.length; i++) {
                        allImages[i].changeMessage = 0;
                    }

                    // Prepare response data
                    const responseData = {
                        imagesToday: allImages
                    };

                    // Send response
                    res.status(200).json(responseData);
                });
            }



        });
    });
});





// router.get('/', (req, res) => {
//     let sqlImages = `
//         SELECT ROW_NUMBER() OVER (ORDER BY image.score DESC) AS rank, image.*, datum.score AS datum_score
//         FROM image
//         LEFT JOIN datum ON image.mid = datum.mid
//         WHERE DATE(datum.date) = CURDATE() - INTERVAL 1 DAY
//         ORDER BY image.score DESC
//     `;

//     conn.query(sqlImages, (err, imageResult) => {
//         if (err) {
//             console.error("ERROR fetching images:", err);
//             return res.status(500).json({ err: "Error fetching images" });
//         }

//         if (imageResult.length > 0) {
//             for (let i = 0; i < imageResult.length; i++) {

//                 let changeMessage;
//                 if (imageResult[i].score > imageResult[i].datum_score) {
//                     // "Score Up"
//                     changeMessage = 1;
//                 } else if (imageResult[i].score < imageResult[i].datum_score) {
//                     // "Score Down"
//                     changeMessage = 2;
//                 } else {
//                     // "Score remains the same"
//                     changeMessage = 0;
//                 }

//                 // Add changeMessage property to each image object
//                 imageResult[i].changeMessage = changeMessage;
//             }

//             // Prepare response data
//             const responseData = {
//                 images: imageResult,
//             };

//             // Send response
//             res.json(responseData);
//             console.log(responseData);
//         } else {
//             console.log("No images found");
//             res.status(404).json({ message: "No images found" });
//         }
//     });
// })