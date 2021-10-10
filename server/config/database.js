const Sequelize = require('sequelize');
module.exports = new Sequelize('plates', 'root', 'bitnami', {
    host: 'localhost',
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
});