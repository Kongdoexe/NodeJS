import express from "express";
import { router as Origin } from "./api/Origin";
import { router as Upload} from "./api/uploadImage";
import { router as image } from './api/Image';
import { router as Vote } from './api/vote';
import { router as home } from './api/home';
import { router as profile } from './api/profile';
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
app.use("/Image", image);
app.use("/Vote", Vote);
app.use("/Home", home);
app.use("/Profile", profile);