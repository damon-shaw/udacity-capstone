const Sequelize = require('sequelize');
const db = require('../config/database');

const PlateAvailabilityRequest = db.define('plateAvailabilityRequest', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    plateID: {
        type: Sequelize.STRING
    },
    timestamp: {
        type: Sequelize.DATE
    },
    isAvailable: {
        type: Sequelize.BOOLEAN
    }
});