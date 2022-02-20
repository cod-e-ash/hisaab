import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true, minlength: 4, maxlength: 20},
    fullname: {type: String, required: true, min: 4},
    email: {type: String},
    role: {type:String, required: true},
    password: {type: String, required:true, unique: true}
});

UserSchema.methods.genAuthToken = function() {
    return token = jwt.sign({
        username: this.username,
        fullname: this.fullname,
        role: this.role
    }, 
    config.get('jwtPrivateKey'));
}

function validateUser(user) {

    if(user.username.length < 4 || user.username.length > 20) return false;
    if(user.fullname.length < 4) return false;
    if(user.password.length < 5 || user.password.length > 20) return false;
    if(!user.email || user.email.length < 5 || user.email.length > 30 || 
        !user.email.includes('@') || !user.email.includes('.')) return false;
    if(user.role.length < 4 || user.role.length > 20) return false;
    return true;
}

const User = mongoose.model('User', UserSchema);
export { User, validateUser as validate }