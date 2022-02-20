import express from 'express';
import { User, validate } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await UserSchema.find().select('-password');
    if (!users) return res.status(400).send("No users!");
    res.status(200).send(users);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await UserSchema.findOne({"username": req.body.username});
    if (user) return res.status(400).send("User already exists!");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password,salt);
    user = UserSchema({
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
        password: hash,
        role: req.body.role
    });

    await user.save();
    const token = user.genAuthToken()
    res.status(201).send(token);
});

router.delete('/:username', auth, admin, async (req, res) => {
    const user = UserSchema.deleteOne({username: req.params.username});
    if (!user) return res.status(400).send("User not found!");
    res.status(200).send("User Deleted!");
});

export default router;