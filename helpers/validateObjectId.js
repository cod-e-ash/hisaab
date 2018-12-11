const mongoose = require('mongoose');

module.exports = function validateObjectId(objectId, object) {
    if (!mongoose.Types.ObjectId.isValid(objectId)) return `Invalid ${object} Id`;
    return;
}