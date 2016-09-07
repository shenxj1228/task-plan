(function() {
    'use strict';

    angular
        .module('projectTask')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $state, $rootScope, $window, $location, AuthenticationFactory) {
        $rootScope.$state = $state;
        $log.debug('runBlock end');
        AuthenticationFactory.check();
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo, toParams, { location: 'replace' })
            }
            if ((toState.access && toState.access.requiredLogin) && !AuthenticationFactory.isLogged) {
                $state.go('signin');
            } else {
                // check if user object exists else fetch it. This is incase of a page refresh
                if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
                if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            }
        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.role = AuthenticationFactory.userRole;
            // if the user is already logged in, take him to the home page
            if (AuthenticationFactory.isLogged == true && $state.includes('signin')) {
                $state.go('home.warn');
            }
        });
    }

})();
