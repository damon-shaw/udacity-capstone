const winston = require('winston');
const process = require('process');

module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        service: 'platesearch-backend'
    },
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'combined.log',
        })
    ]
});

if(process.env.NODE_ENV !== 'production') {
    module.exports.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}