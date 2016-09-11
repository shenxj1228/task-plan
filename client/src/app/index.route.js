(function() {
    'use strict';

    angular
        .module('projectTask')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider,$httpProvider) {
       $httpProvider.interceptors.push('TokenInterceptor');
        $stateProvider
            .state('home', {
                url: '/home',
                redirectTo: 'home.warn',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: ''
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
                controller: 'MainController',
                controllerAs: ''
            })
            .state('home.task', {
                url: '/task-manage',
                redirectTo: 'home.task.list',
                templateUrl: 'app/main/tpl/task-manage.html',
                controller: 'TaskController',
                controllerAs: 'tk'
            })
            .state('home.task.list', {
                url: '/list',
                templateUrl: 'app/task/list.html',
                controller: 'TaskController',
                controllerAs: 'tk'
            })
            .state('home.task.add', {
                url: '/list',
                templateUrl: 'app/task/add.html',
                controller: 'TaskController',
                controllerAs: 'tk'
            })
            .state('home.project', {
                url: '/project-manage',
                redirectTo: 'home.project.list',
                templateUrl: 'app/main/tpl/project-manage.html',
                controller: 'ProjectController',
                controllerAs: 'pj'
            })
            .state('home.project.list', {
                url: '/list',
                templateUrl: 'app/project/list.html',
                controller: 'ProjectController',
                controllerAs: 'pj'
            })
            .state('home.project.add', {
                url: '/list',
                templateUrl: 'app/project/add.html',
                controller: 'ProjectController',
                controllerAs: 'pj'
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
                url: '/sign-in',
                templateUrl: 'app/user/sign.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('home.user', {
                url: '/user',
                redirectTo: 'home.user.list',
                templateUrl: 'app/main/tpl/user-manage.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('home.user.list', {
                url: '/list',
                templateUrl: 'app/user/list.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('home.user.add', {
                url: '/add',
                templateUrl: 'app/user/add.html',
                controller: 'UserController',
                controllerAs: 'vm'
            });
            $urlRouterProvider.otherwise('/');
    }

})();
