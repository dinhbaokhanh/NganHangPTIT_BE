import { Router } from "express";
import fileController from "../controllers/Resources/filesController.js";
import upload from "../middleware/uploadFiles/upload.js";

const router = Router();

router
    .post('/upload', upload.single("fileName"), fileController.uploadFiles)
    .get('/getAll', fileController.getAllFiles)
    .delete('/delete/:name', fileController.deleteFile)

export default router;