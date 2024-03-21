import { Request, Response } from "express";
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { InsertDatum, Inter, UpdateScore, Vote } from "../model/model";

export const router = express.Router();

router.get('/', (req, res) => {
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

        // Check if results are not empty
        if (todayResult.length > 0) {
            conn.query(sqlImagesYesterday, (err, yesterdayResult) => {
                if (err) {
                    console.error("ERROR fetching images yesterday:", err);
                    return res.status(500).json({ err: "Error fetching images yesterday" });
                }

                // Check if there is data for yesterday
                if (yesterdayResult.length > 0) {
                    // Loop through images today
                    for (let i = 0; i < todayResult.length; i++) {
                        let changeMessage;
                        let resultRank = 0; // Default rank change
                        // Find corresponding image from yesterday
                        const yesterdayImage = yesterdayResult.find((image: { mid: any; }) => image.mid === todayResult[i].mid);
                        if (yesterdayImage) {

                            // Compare ranks
                            if (todayResult[i].rank < yesterdayImage.rank_yesterday) {
                                // "Score Up"
                                changeMessage = 1;
                                resultRank = yesterdayImage.rank_yesterday - todayResult[i].rank;

                            } else if (todayResult[i].rank > yesterdayImage.rank_yesterday) {
                                // "Score Down"
                                changeMessage = 2;
                                resultRank = todayResult[i].rank - yesterdayImage.rank_yesterday;

                            } else {
                                // "Score remains the same"
                                changeMessage = 0;
                            }
                        } else {
                            changeMessage = 0;
                        }

                        // Assign changeMessage and resultRank to today's image
                        todayResult[i].resultRank = resultRank;
                        todayResult[i].changeMessage = changeMessage;
                    }
                } else {
                    console.log("No images found Yesterday");
                    res.status(404).json({ message: "No images found Yesterday" });
                }

                // Prepare response data
                const responseData = {
                    imagesToday: todayResult,
                };
                // Send response
                res.status(200).json(responseData);
            });
        } else {

            let sqlImages = `
                SELECT ROW_NUMBER() OVER (ORDER BY image.score DESC) AS rank, image.*
                FROM image
                ORDER BY image.score DESC
            `;

            conn.query(sqlImages, (err, result) => {
                if (err) {
                    console.log("No images found");
                    res.status(404).json({ message: "No images found" });
                }

                res.json(result);

            });

        }
    });
});
