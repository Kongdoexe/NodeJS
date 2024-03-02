import express from "express";
import { router as Test } from "./api/Test";
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
app.use("/", Test);
app.use("/Origin", Origin);