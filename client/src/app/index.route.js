(function() {
    'use strict';

    angular
        .module('projectTask')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .state('home.warn', {
                url: '/warn',
                templateUrl: 'app/main/tpl/warn.html',
                controller: 'MainController',
                controllerAs: ''
            })
            .state('home.info', {
                url: '/info',
                templateUrl: 'app/main/tpl/info.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('home.operate', {
                url: '/operate',
                templateUrl: 'app/main/tpl/operate.html',
                controller: 'MainController',
                controllerAs: ''
            })
            .state('home.schedule', {
                url: '/schedule',
                templateUrl: 'app/main/tpl/schedule.html',
                controller: 'MainController',
                controllerAs: ''
            })
            .state('sign', {
                url: '/user/sign',
                templateUrl: 'app/user/sign.html',
                controller: 'UserController',
                controllerAs: 'vm'
            });
            
            $urlRouterProvider.otherwise('/');
    }

})();
