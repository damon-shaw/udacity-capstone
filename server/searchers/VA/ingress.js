const Queue = require('bull');
const searcher = require('./VA');

module.exports.Queue = new Queue('VA platesearching', { redis: { host: 'localhost' } });

this.Queue.process(async (job, done) => {
    
    console.log("Processing a queue item!");
    console.log(job.data);

    let plateID = job.data.plateID;

    try {
        let isAvailable = await searcher.checkAvailability(plateID);
        done(null, { isAvailable });
    }
    catch(err) {
        done(err, null);
    }
});