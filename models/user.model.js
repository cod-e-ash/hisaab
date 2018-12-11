const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = mongoose.Schema({
    username: {type: String, required: true, unique: true, minlength: 4, maxlength: 20},
    fullname: {type: String, required: true, min: 4},
    email: {type: String},
    role: {type:String, required: true},
    password: {type: String, required:true, unique: true}
});

User.methods.genAuthToken = function() {
    return token = jwt.sign({
        username: this.username,
        fullname: this.fullname,
        role: this.role
    }, 
    config.get('jwtPrivateKey'));
}

function validateUser(user) {
    const UserSchema = {
        username: Joi.string().required().min(4).max(20),
        fullname: Joi.string().required().min(4),
        email: Joi.string(),
        role: Joi.string().required(),
        password: Joi.string().required()
    }

    return Joi.validate(user, UserSchema);
}

module.exports.User = mongoose.model('User', User);
module.exports.validate = validateUser;