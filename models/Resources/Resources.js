import mongoose from 'mongoose';
import _throw from '../../utils/_throw.js';
import { getStorage, ref, deleteObject } from 'firebase/storage';

const resourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'name required',
            maxlength: 100,
        },

        type: {
            type: String,
            trim: true,
            required: 'type required',
        },

        size: {
            type: Number,
            min: 0,
            max: 10 * 1024 * 1024,
            default: 0,
            required: 'size required',
        },

        path: {
            type: String,
            trim: true,
            required: 'path required',
        },

        createdAt: {
            type: Date,
            default: new Date(),
        },
    }

);

resourceSchema.pre('findOneAndDelete', async function (next) {
    const foundResource = await this.model.findById(this.getQuery());
    if (foundResource) {
        const { path } = foundResource;

        const storage = getStorage();
        const desertRef = ref(storage, path);

        await deleteObject(desertRef);
        console.log('deleted file in firebase');
    }
    next();
});

resourceSchema.pre('deleteMany', async function (next) {
    const foundResources = await this.model.find(this.getFilter());

    const storage = getStorage();

    for (const document of foundResources) {
        const desertRef = ref(storage, document.path);
        await deleteObject(desertRef);
    }

    console.log(`deleted ${foundResources.length} files in firebase`);
    next();
});

const Resources = mongoose.model('resources', resourceSchema);

export default Resources;