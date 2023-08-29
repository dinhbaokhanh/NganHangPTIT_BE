import express from "express"
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import firebase from "./services/firebase.js";
import { getFirestore } from "@firebase/firestore";
import pathArr from "./routes/index.js";
import { publicPath } from "./config/path.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use('/static', express.static(publicPath));

// database connection
const URI = 'mongodb+srv://dinhbaokhanh:dinhbaokhanh12345@cluster0.8dkbeuf.mongodb.net/nganhangptit';
mongoose.connect(URI, {})
    .then((res) => app.listen(8000))
    .catch((err) => console.log(err));


// firebase
firebase();
export const firestore = () => getFirestore();

pathArr.forEach(({path, route}) => app.use(path, route));

