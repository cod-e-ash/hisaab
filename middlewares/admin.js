
export default function admin (req, res, next) {
    // if (!req.user.role != 'admin') return res.status(403).send("Insufficient authority!");
    next();
}