'use strict';

var angular = require('angular');

angular
    .module('portal')
    .controller('grscicollCtrl', grscicollCtrl);

/** @ngInject */
function grscicollCtrl(Page, $state, $translate) {
    var vm = this;

    Page.drawer(false);
    vm.$state = $state;
}

module.exports = grscicollCtrl;

