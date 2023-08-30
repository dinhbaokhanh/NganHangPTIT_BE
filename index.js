import express from "express"
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import firebase from "./services/firebase.js";
import { getFirestore } from "@firebase/firestore";
import pathArr from "./routes/index.js";
import { publicPath } from "./config/path.js"

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/static', express.static(publicPath));

app.get('/check', (req, res) => {
    res.status(200).send({
        message: "Server is Working !!"
    })
})
// database connection
mongoose.connect(process.env.DB_URI, {})
    .then((res) => app.listen(port))
    .catch((err) => console.log(err));


// firebase
firebase();
export const firestore = () => getFirestore();

pathArr.forEach(({path, route}) => app.use(path, route));

