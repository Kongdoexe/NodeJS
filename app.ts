import express from "express";
import { router as Origin } from "./api/Origin";
import { router as Upload} from "./api/uploadImage";
import bodyParser from "body-parser";
import cors from "cors";


export const app = express();


app.use(
    cors({
        origin: "*"
    })
);
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/Origin", Origin);
app.use("/Upload", Upload);