import { logger } from '../helpers/logger.js';

export default function(err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send("Internal Server Error");
}