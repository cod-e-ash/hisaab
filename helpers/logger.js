import winston from 'winston';

export const logger = winston.createLogger({
    level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

// If not in prod
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.colorize()
  }));
}