const Sequelize = require('sequelize');
const db = require('../config/database');

const Plate = db.define(
    'plate',
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        state: {
            type: Sequelize.STRING
        },
        available: {
            type: Sequelize.BOOLEAN
        },
        lastChecked: {
            type: Sequelize.DATE
        }
    },
    {
        timestamps: false,
        hooks: {
            beforeCreate: (data) => {
                data.state = data.state.toUpperCase();
            },
            beforeUpdate: (data) => {
                data.state = data.state.toUpperCase();
            },
            beforeSave: (data) => {
                data.state = data.state.toUpperCase();
            },
            beforeUpsert: (data) => {
                data.state = data.state.toUpperCase();
            }
        }
    }
);

module.exports = Plate;