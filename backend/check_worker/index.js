const db = require('../config/database');
const Plate = require('../models/Plate');
// const _ = require('lodash');

const art = require('../lib/AvailabilityRequestThreadpool');

const INTERVAL_MS = 3000;

// const supportedStates = Object.keys(require('../searchers'));

db.authenticate().then(() => {
    console.log('Connected to the database.');

    setInterval(async () => {
        // Pick a random plate in the database, regardless of state.
        const randomPlate = await Plate.findOne({ order: db.random() });

        // Wait for the recheck request to complete.
        const response = await art.createAvailabilityRequest(
            randomPlate.dataValues.id, randomPlate.dataValues.state
        ).value;
        console.log(`[CW] Is ${randomPlate.dataValues.id} available? ${response}`);

        randomPlate.isAvailable = response;
        randomPlate.lastChecked = new Date();
        await randomPlate.save();
        console.log(`Plate ${randomPlate.dataValues.id} for state ${randomPlate.dataValues.state} rechecked.`)
      
      }, INTERVAL_MS);
});



