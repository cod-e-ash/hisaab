import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username:req.body.username});
    if (!user) return res.status(400).send("Invalid User or password!");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send("Invalid User or password!");

    const token = user.genAuthToken();
    res.send(token);
});

function validate(user) {

    if(!user || !user.username || user.username.length < 2 || user.username.length > 30)
    if(!user || !user.password || user.password.length < 2 || user.password.length > 30)
    return { error: { message: 'Invalid User or password!' } };
}

export default router;