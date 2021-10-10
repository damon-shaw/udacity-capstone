var moment = require('moment');

module.exports.requestPool = {};

module.exports.createAvailabilityRequest = function(plateID, state) {

    // Normalize the plate ID and state by making them uppercase.
    plateID = plateID.toUpperCase();
    state = state.toUpperCase();

    // If a submap for this state has not already been created, create it now.
    if(!this.requestPool[state]) this.requestPool[state] = {};
    
    // If a request for this plate ID is already underway, don't create a new request. Return
    // the one in progress.
    if(this.requestPool[state][plateID] != null) {
        console.log("Request pool item is not null.")
        if(moment().diff(this.requestPool[state][plateID].created, 'seconds') < 30)
            return this.requestPool[state][plateID];
    }

    // If not, create a new one and return the Promise for it.
    this.requestPool[state][plateID] = {
        created: new Date(),
        value: new Promise(async (resolve, reject) => {

            // Select a search processor based on the state selected.
            let searcherQueue = require('../searchers')[state].queue;

            let job;
            try {
                job = await searcherQueue.add({ plateID });
            }
            catch(err) {
                console.log("Ran into an error!");
                console.log(err);
                reject(err);
            }

            searcherQueue.on('completed', (readJob, result) => {
                if(readJob.id === job.id) {
                    console.log("This is my job!");
                    resolve(result.isAvailable);
                }
            });

            // job.finished().then((errors, result) => {
            //     console.log("The job finished!");
            //     console.log(result);
            //     resolve(false);
            // })
        })
    };

    return this.requestPool[state][plateID];

}

module.exports.getAvailabilityRequest = function(plateID, state) {
    // Normalize the plate ID and state by making them uppercase.
    plateID = plateID.toUpperCase();
    state = state.toUpperCase();

    // If a submap for this state has not already been created, create it now.
    if(!this.requestPool[state]) this.requestPool[state] = {};

    return this.requestPool[state][plateID];
}