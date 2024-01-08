import winston from 'winston';

const customOptionsLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
};

const logger = winston.createLogger({
    levels: customOptionsLevels.levels,
    transports: [
        new winston.transports.File({
            filename: './src/logs/errors.log',
            level: 'warn',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customOptionsLevels.colors }),
                winston.format.simple(),
            ),
        }),
    ],
});

export default logger;