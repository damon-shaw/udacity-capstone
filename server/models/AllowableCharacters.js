const Sequelize = require('sequelize');
const db = require('../config/database');

const AllowableCharacters = db.define(
    'allowable_chars',
    {
        state: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        charset: {
            type: Sequelize.STRING
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

module.exports = AllowableCharacters;