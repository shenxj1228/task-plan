(function() {
    'use strict';

    angular
        .module('projectTask')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $state, $rootScope,  $window, AuthenticationFactory) {
        //console.log($window.sessionStorage.token);
        $rootScope.$state = $state;

        AuthenticationFactory.check();
        var unRegister1 = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
            if (!AuthenticationFactory.isLogged) {
                if (toState.name != 'signin') {
                    $log.debug('AuthenticationFactory.isLogged:' + AuthenticationFactory.isLogged + '  redict to sign-in');
                    event.preventDefault();
                    $state.go('signin');
                }
            } else {
                // check if user object exists else fetch it. This is incase of a page refresh
                if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
                if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
                if (toState.name === 'signin') { $state.go('home.warn'); }
            }
        });
        var unRegister2 = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.role = AuthenticationFactory.userRole;

            // if the user is already logged in, take him to the home page

            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo, toParams, { location: 'replace' });
            }
        });
        $log.debug('runBlock end');
    }

})();
