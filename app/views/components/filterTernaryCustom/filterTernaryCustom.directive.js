'use strict';

var angular = require('angular');
angular
    .module('portal')
    .directive('filterTernaryCustom', filterTernaryCustomDirective);

/** @ngInject */
function filterTernaryCustomDirective(BUILD_VERSION) {
    var directive = {
        restrict: 'A',
        transclude: true,
        templateUrl: '/templates/components/filterTernaryCustom/filterTernaryCustom.html?v=' + BUILD_VERSION,
        scope: {
            filterState: '=',
            filterConfig: '='
        },
        replace: true,
        controller: filterTernaryCustom,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function filterTernaryCustom() {
        var vm = this;
        vm.queryKey = vm.filterConfig.queryKey;

        vm.change = function() {
            vm.apply();
        };

        vm.apply = function() {
            vm.filterConfig.filter.updateParam(vm.queryKey, vm.query);
        };

        function updateQuery(q) {
            if (typeof q === 'string') {
                vm.query = q;
            } else {
                vm.query = undefined;
                vm.apply();
            }
        }

        updateQuery(vm.filterState.query[vm.queryKey]);
    }
}

module.exports = filterTernaryCustomDirective;
