const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const moment = require('moment');
const logger = require('./config/logging');

const Plate = require('./models/Plate');
const AllowableCharacters = require('./models/AllowableCharacters');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3500;


const HttpStatus = require('http-status-codes');
const { Op } = require('sequelize');

const availReqTP = require('./lib/AvailabilityRequestThreadpool');

const {
    checkPlateSchema,
    retrievePlateSchema,
    searchPlatesSchema,
    batchPlateSchema,
    randomPlatesSchema
} = require('./schemas');

async function connectToDatabase(database) {
    let isDatabaseConnected = false;
    while(!isDatabaseConnected) {
        try {
            await database.authenticate();
            logger.info(`Connection to database at ${db.config.host}:${db.config.port} successful.`);
            isDatabaseConnected = true;
        }
        catch(err) {
            console.error(err);
            logger.error(`Failed to connect to the database at ${db.config.host}:${db.config.port}. Waiting, then retrying.`);
            await new Promise((res) => setTimeout(() => { res() }, 3000));
        }
    }
}

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.get('/plate', async (req, res) => {

    // Try to validate that the request parameters meet the requirements
    // set forth by the schema.
    let reqData;
    try {
        reqData = await searchPlatesSchema.validate(req.query);
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST);
        res.send({ error });
        // Return early. Do not continue.
        return;
    }

    let likeValue = null;
    switch(reqData.searchType) {
        case "BEGINS_WITH":
            likeValue = `${reqData.searchValue}%`;
            break;
        case "ENDS_WITH":
            likeValue = `%${reqData.searchValue}`;
            break;
        case "LIKE":
            likeValue = `%${reqData.searchValue}%`;
            break;
    }

    const options = {
        where: {
            id: { [Op.like]: likeValue },
            state: reqData.state,
        },
        limit: 100
    };
    if(reqData.available !== undefined)
        options.where.available = reqData.available;

    const plates = await Plate.findAll(options);

    res.send(plates);
});

app.get('/plate/:state/:id', async (req, res) => {
    // Try to validate that the request parameters meet the requirements
    // set forth by the schema.
    try {
        await retrievePlateSchema.validate(req.params);
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST);
        res.send({ error });
        // Return early. Do not continue.
        return;
    }

    // Try to find all plates meeting the parameters defined by the schemas.
    try {
        const plates = await Plate.findAll({
            where: {
                id: req.params['id'],
                state: req.params['state']
            }
        });

        if(plates.length > 0) {
            res.status(HttpStatus.OK);
            res.send(plates[0].dataValues);
        }
        else {
            res.status(HttpStatus.NOT_FOUND);
            res.send({});
        }
    }
    catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.status({ error });
    }
});

app.get('/random', async (req, res) => {

    // Try to validate that the request parameters meet the requirements
    // set forth by the schema.
    let reqData;
    try {
        reqData = await randomPlatesSchema.validate(req.query);
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST);
        res.send({ error });
        // Return early. Do not continue.
        return;
    }

    console.log(reqData);

    let options = {
        where: {},
        limit: reqData['limit'],
        order: db.random()
    }
    if(reqData.available !== undefined)
        options.where.available = reqData.available;
    if(reqData.state !== undefined)
        options.where.state = reqData.state;

    console.log(options);

    try {
        const plates = await Plate.findAll(options);
    
        console.log("Returning " + plates.map(plate => plate.dataValues));
    
        res.status(HttpStatus.OK);
        res.send(plates.map(plate => plate.dataValues));
    }
    catch (error) {
        console.log(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send({ error });
    }
});

app.post('/check/:state/:id', async (req, res) => {

    let reqData;
    try {
        reqData = await checkPlateSchema.validate(req.params);
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST);
        res.send({ error });
        return;
    }

    try {
        console.log("Waiting on an availability request.");
        let isAvailable = await availReqTP.createAvailabilityRequest(
            reqData['id'],
            reqData['state']
        ).value;

        console.log("Updating database.");
        await Plate.upsert(
            {
                id: reqData['id'],
                state: reqData['state'],
                available: isAvailable,
                lastChecked: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        );
    
        console.log(`${reqData['id']} is available? ${isAvailable}`);
    
        res.send({ isAvailable });
    }
    catch(err) {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send({
            error: err
        });
    }
});

app.post('/batch/plate', async (req, res) => {

    let reqData;
    try {
        reqData = await batchPlateSchema.validate(req.body);
    }
    catch(error) {
        res.status(HttpStatus.BAD_REQUEST);
        res.send({ error });
        return;
    }

    try {
        const plates = await Plate.findAll({
            where: {
                id: {
                    [Op.in]: reqData.plates
                }
            }
        });
        res.send(plates);
    }
    catch(error) {
        console.log(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send({ error });
    }
});

app.get('/state/supported', async (req, res) => {

    try {
        let states = Object.values(require('./searchers'));
        states = states.map(state => ({
            name: state.searcher.metadata.state,
            abbreviation: state.searcher.metadata.stateAbbr
        }));

        res.send(states);
    }
    catch(error) {
        console.trace(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send();
    }

});

app.get('/state/:state/charset', async (req, res) => {
    try {
        const charset = await AllowableCharacters.findOne({
            where: { state: req.params.state }
        });

        console.log(charset);

        res.send(charset);
    }
    catch(error) {
        console.trace(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send();
    }
});

app.get('/status', (req, res) => {
    res.status(HttpStatus.OK);
    res.send('I\'m alive!');
});

connectToDatabase(db).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}.`)
    });
});