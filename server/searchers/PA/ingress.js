const Queue = require('bull');
const searcher = require('./PA');

module.exports.Queue = new Queue('PA platesearching', { redis: { host: 'localhost' } });

this.Queue.process(async (job, done) => {
    
    console.log("Processing a queue item!");
    console.log(job.data);

    let plateID = job.data.plateID;

    let isAvailable = await searcher.checkAvailability(plateID);

    done(null, { isAvailable });
});