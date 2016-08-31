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
            .state('signin', {
                url: '/user/sign-in',
                templateUrl: 'app/user/sign.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('user', {
                url: '/user',
                templateUrl: 'app/user/user.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('user.manage', {
                url: '/manage',
                templateUrl: 'app/user/tpl/manage.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('user.add', {
                url: '/add',
                templateUrl: 'app/user/tpl/add.html',
                controller: 'UserController',
                controllerAs: 'vm'
            });
            $urlRouterProvider.otherwise('/');
    }

})();
