'use strict';

/**
 * @fileoverview Proxy endpoint to return publisher count for a given region.
 */

let express = require('express'),
    router = express.Router(),
    PublisherRegional = require('../../../models/gbifdata/publisher/publisherRegional'),
    log = require('../../../../config/log');

module.exports = app => {
    app.use('/api', router);
};

router.get('/publisher/count', (req, res, next) => {
    PublisherRegional.groupBy(req.query)
        .then(results => {
            let count = {};
            count.region = req.query.gbifRegion;
            count.publisher = results.length;
            res.json(count);
        })
        .catch(err => {
            log.error('Error in /api/publisher/count controller: ' + err.message);
            next(err)
        });
});