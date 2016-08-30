(function() {
    'use strict';

    angular
        .module('projectTask')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log,$state,$rootScope) {
        $rootScope.$state = $state;
        $log.debug('runBlock end');
    }

})();
