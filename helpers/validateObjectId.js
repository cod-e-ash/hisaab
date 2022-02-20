import mongoose from 'mongoose';

export default function validateObjectId(objectId, object) {
    if (!mongoose.Types.ObjectId.isValid(objectId)) return `Invalid ${object} Id`;
    return;
}