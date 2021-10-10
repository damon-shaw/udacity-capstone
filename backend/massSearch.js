

const art = require('./lib/AvailabilityRequestThreadpool');

const targets = [
    { state: 'PA', id: 'SETTING' },
    { state: 'PA', id: 'TEST' },
    { state: 'PA', id: 'RETRACT' },
    { state: 'PA', id: 'DAMON' },
    { state: 'PA', id: 'SEVERAL' },
    { state: 'PA', id: 'AGAIN' },
    { state: 'PA', id: 'PANTHER' },
];

const promises = [];

async function main() {
    for(let target of targets) {
        let result = await art.createAvailabilityRequest(target.id, target.state).value;
        console.log(result);
    }
}

main();