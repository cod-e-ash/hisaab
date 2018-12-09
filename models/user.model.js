const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.Schema({
    name: {type: String, required: true},
    role: {type:String, required: true},
    pass: {type: String, required:true}
});

function validateUser(user) {
    const UserSchema = {
        name: Joi.string().required().min(4),
        role: Joi.string().required(),
        pass: Joi.string().required()
    }

    return Joi.validate(user, UserSchema);
}

exports.User = mongoose.model('User', User);
exports.validate = validateUser;