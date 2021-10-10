const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const assert = require('assert');

const app = "http://localhost:3500";

chai.use(chaiHttp);

const Plate = require('../models/Plate');
const db = require('../config/database');

before((done) => {
    db.authenticate().then(() => {
        console.log("Connected to the database!");
        done();
    })
    .catch((error) => {
        console.trace(error);
    });
});

describe('STATES', function() {
    describe('SUPPORTED STATES', function() {
        it('should return the correct supported states', function(done) {
            chai.request(app)
                .get(`/state/supported`)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.above(0);
                    res.body[0].should.be.a('object');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('abbreviation');
                    done();
                });
        });
    });
});

describe('PLATES', function() {
    // Before each test, clear the database.
    beforeEach(function() {
        Plate.destroy({
            where: {},
            truncate: true
        });
    });

    describe('CHECK FOR PLATE', function() {

        describe('LOAD TESTING', function() {
            it('should handle concurrent requests', (done) => {
                let numReqs = 10;
                let promises = [];
                for(let i = 0; i < numReqs; i++) {
                    promises.push(
                        chai.request(app)
                            .post(`/check/pa/test${i}`)
                            .send()
                    );
                }

                Promise.all(promises).then(results => {
                    console.log(
                        results.map(res => ({
                            reqUrl: res.request.url,
                            body: res.body
                        }))
                    );
                    done();
                });
            }).timeout(50000);
        });

        describe('VA', function() {
            it('should successfully check for new plates', (done) => {
                chai.request(app)
                    .post(`/check/va/corsair`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('isAvailable');
                        res.body.isAvailable.should.be.eql(false);
                        done();
                    });
            }).timeout(5000);

            it('should cache repeated checks for quick retrieval', (done) => {
                let firstRequestTime, secondRequestTime;
                chai.request(app)
                    .post(`/check/va/corsair`)
                    .send()
                    .end((err, res) => {
                        // console.log(res);
                        done();
                    });
            })
        });
    });
});

// describe('PLATES', function() {

// });