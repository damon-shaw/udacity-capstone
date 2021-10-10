module.exports.VA = {
    searcher: require('./VA/VA'),
    queue: require('./VA/ingress').Queue
};

module.exports.PA = {
    searcher: require('./PA/PA'),
    queue: require('./PA/ingress').Queue
};