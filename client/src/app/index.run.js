(function() {
    'use strict';

    angular
        .module('projectTask')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $state, $rootScope, $window, AuthenticationFactory,ngProgressFactory) {
        $rootScope.$state = $state;
        var statechangeProgressbar = ngProgressFactory.createInstance();
        statechangeProgressbar.setHeight('2px');
             statechangeProgressbar.setColor('#77b6ff');
        AuthenticationFactory.check();
        var stateChgStart = $rootScope.$on('$stateChangeStart', function(event, toState) {
             statechangeProgressbar.start();
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
        $rootScope.$on('$destroy', stateChgStart);
        var stateChgSuccess = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
            $rootScope.role = AuthenticationFactory.userRole;

            // if the user is already logged in, take him to the home page

            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo, toParams, { location: 'replace' });
            }
            statechangeProgressbar.complete();
        });
        $rootScope.$on('$destroy', stateChgSuccess);
        $log.debug('runBlock end');
    }


})();
