'use strict';

// @todo get participants and group by region
// @todo get participants and group by membership types
// @todo merge with directory.js after readability refactor

let helper = require('../../util/util');
let dataApi = require('../apiConfig');
let log = require('../../../../config/log');
let Directory = require('./directory');
let Q = require('q');
let _ = require('lodash');

let DirectoryParticipants = function (record) {
    this.record = record;
};

DirectoryParticipants.prototype.record = {};

// accepts gbifRegion & membershipType as params
// /api/directory/participants?gbifRegion=AFRICA&membershipType=associate_country_participant
DirectoryParticipants.groupBy = (query) => {
    let deferred = Q.defer();
    let requestUrl = dataApi.directoryParticipants.url;
    let options = Directory.authorizeApiCall(requestUrl);
    helper.getApiDataPromise(requestUrl, options)
        .then(result => {
            let output = {};
            let participantsByRegion;
            let participantsByMembership;

            result.results.forEach(p => {
                Directory.setMembership(p);
            });

            if (Object.keys(query).length === 0 && query.constructor === Object) {
                output = result.results;
            }
            else {
                // if gbifRegion is in params
                if (query.hasOwnProperty('gbifRegion')) {
                    participantsByRegion = _.groupBy(result.results, p => {
                        return (p.hasOwnProperty('gbifRegion')) ? p.gbifRegion : 'NON_ACTIVE';
                    });
                    if (typeof query.gbifRegion !== 'undefined' && participantsByRegion.hasOwnProperty(query.gbifRegion)) {
                        output = participantsByRegion[query.gbifRegion];
                    }
                }

                // if membershipType is in params
                if (query.hasOwnProperty('membershipType')) {
                    participantsByMembership = _.groupBy(result.results, p => {
                        return (p.hasOwnProperty('membershipType')) ? p.membershipType : 'NOT_SPECIFIED';
                    });
                    if (typeof query.membershipType !== 'undefined' && participantsByMembership.hasOwnProperty(query.membershipType)) {
                        output = participantsByMembership[query.membershipType];
                    }
                }

                if (query.hasOwnProperty('gbifRegion') && query.hasOwnProperty('membershipType')) {
                    output = _.intersectionBy(participantsByRegion[query.gbifRegion], participantsByMembership[query.membershipType], 'countryCode');
                }
            }

            deferred.resolve(output);
        })
        .catch(e => {
            deferred.reject(e + ' in directoryParticipants(). ');
            log.error(e);
        });
    return deferred.promise;
};

module.exports = DirectoryParticipants;