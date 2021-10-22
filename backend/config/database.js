const Sequelize = require('sequelize');

module.exports = new Sequelize(
    process.env.DB_NAME || 'plates',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'bitnami',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: 3306,
        operatorAliases: false,
        logging: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);