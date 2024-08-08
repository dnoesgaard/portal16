'use strict';

let _ = require('lodash'),
    apiConfig = require('../../../models/gbifdata/apiConfig'),
    userAgent = require('../../../../config/config').userAgent,
    querystring = require('querystring'),
    request = rootRequire('app/helpers/request');
let TIMEOUT = 8000;

module.exports = {
    start: function() {
        return start(testConfig);
    }
};

async function start(tests) {
    try {
        let results = await Promise.all(tests.map(function(test) {
            return test();
        }));
        return {
            components: _.keyBy(results, 'component')
        };
    } catch (err) {
        return {
            error: 'Failed to resolve load',
            severity: 'CRITICAL'
        };
    }
}

async function crawlerLoad() {
    // dataset process running)
    let options = {
        url: apiConfig.crawlingDatasetProcessRunning.url + '?vLoad=' + Date.now(),
        json: true,
        userAgent: userAgent,
        timeout: TIMEOUT
    };
    let response = await request(options);
    if (response.statusCode != 200) {
        return {
            component: 'CRAWLER',
            error: 'No response',
            severity: 'CRITICAL'
        };
    }
    let result = response.body;

    // pipelines process running
    let optionsPipeline = {
        url: apiConfig.pipelinesProcessRunning.url + '?vLoad=' + Date.now(),
        json: true,
        userAgent: userAgent,
        timeout: TIMEOUT
    };
    let responsePipeline = await request(optionsPipeline);
    if (response.statusCode != 200) {
        return {
            component: 'CRAWLER',
            error: 'No response',
            severity: 'CRITICAL'
        };
    }
    let resultPipeline = responsePipeline.body;

    let totalResults = result.length + resultPipeline.count;
    return {
        component: 'CRAWLER',
        load: totalResults,
        severity: totalResults > 1000 ? 'WARNING' : 'OPERATIONAL' // arbitrary threshold, but decided in collaboration with Matt. It only markes the number in red on the status page
    };
}

async function downloadQueue() {
    let query = {
        timezone: 'GMT',
        filter: 'status=RUNNING',
        _dc: Date.now()
    };
    let options = {
        url: apiConfig.oozie.url + 'jobs?' + querystring.stringify(query),
        json: true,
        userAgent: userAgent,
        timeout: TIMEOUT
    };
    let response = await request(options);
    if (response.statusCode != 200) {
        return {
            component: 'DOWNLOAD',
            error: 'No response',
            severity: 'CRITICAL'
        };
    }
    let result = response.body;
    return {
        component: 'DOWNLOAD',
        load: result.total,
        severity: result.total > 200 ? 'WARNING' : 'OPERATIONAL'
    };
}

// tests are expected to return {component name, load?: [high, medium, low], values: {custom obj}}
let testConfig = [crawlerLoad, downloadQueue];
