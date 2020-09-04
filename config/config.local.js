import {format} from 'winston'

var config = {};

config.project = {
    port: 3047,
    env: 'dev',
    tz: 'America/Sao_Paulo'
};

config.db = {
    user: 'ann-user',
    host: 'localhost',
    password: '123456',
    database: 'ann',
    port: 27017,
};

config.logWinston = {
    transports: {
        file: {
            level: 'debug',
            filename: `./logs/app.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
            format: format.combine(
              format.timestamp(),
              format.simple(),
              //format.json()
            ),
            handleExceptions: true
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            format: format.simple(),
            colorize: true,
        }
    }
};

module.exports = config;