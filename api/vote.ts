import { Request, Response } from "express";
import express from "express";
import { conn } from "../dbconnect";

export const router = express.Router();

router.get('/test', (req: Request, res: Response) => {

    return res.send("Test");
});

router.get("/", (req: Request, res: Response) => {

    let user = [
        {
            uid: 1,
            name: 'Aem'
        },
        {
            uid: 2,
            name: 'm'
        },
        {
            uid: 3,
            name: 'Test'
        }
    ]


    return res.status(200).json({
        user,
    });
});


export default router;