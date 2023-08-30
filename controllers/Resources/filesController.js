import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import Resources from "../../models/Resources/Resources.js"
import _throw from '../../utils/_throw.js';

const fileController = {
    uploadFiles: async (req, res) => {
        const file = req.file;
        const { originalname, buffer } = file;
        const path = `Tài Liệu/${originalname}`;
        const storageRef = ref(getStorage(), path);
        const result = await uploadBytes(storageRef, buffer)
        const url = await getDownloadURL(result.ref);
        try {
            const newFile = new Resources({
                name: originalname,
                type: file.mimetype,
                size: file.size,
                path: path,
                url: url,
                createdAt: new Date(),
                type: "tailieu"
            });
            await newFile.save();
            res.status(200).json({ message: 'File uploaded successfully', data: newFile });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllFiles: async (req, res) => {
        try {
            const storageRef = ref(getStorage(), 'Tài Liệu');
            const result = await listAll(storageRef);
            const files = await Promise.all(result.items.map(async item => ({
                name: item.name,
                fullPath: item.fullPath,
                url: await getDownloadURL(item)
            })));
            res.status(200).json({ message: 'Files retrieved successfully', data: files });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    deleteFile: async (req, res) => {
        const { name } = req.params;
        try {
            const path = `Tài Liệu/${name}`;
            const storageRef = ref(getStorage(), path);
            await deleteObject(storageRef);
            res.status(200).json({ message: 'File deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

export default fileController;