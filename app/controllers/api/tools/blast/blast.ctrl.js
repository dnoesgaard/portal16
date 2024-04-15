'use strict';
let express = require('express'),
    router = express.Router(),
    cors = require('cors'),
    blast = require('./blast'),
    _ = require('lodash');


module.exports = function(app) {
    app.use('/api', router);
};
router.options('/blast', cors({origin: '*'}));
router.post('/blast', cors({origin: '*'}), function(req, res) {
    blast.blast(req.body, _.get(req, 'query.verbose', false))
    .then((response) => res.status(200).json(response))
    .catch((err) => {
        res.status(err.statusCode || 503).send(err.body || '');
    });
});

router.post('/blast/batch', cors({origin: '*'}), function(req, res) {
    blast.blastBatch(req.body, _.get(req, 'query.verbose', false))
    .then((response) => res.status(200).json(response))
    .catch((err) => {
        res.status(err.statusCode || 503).send(err.body || '');
    });
});

