import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, moduleName }) => {
          return `${timestamp} [${moduleName}] [${level}] - ${message}`;
        })
      )
    })
  ]
});

export default logger;