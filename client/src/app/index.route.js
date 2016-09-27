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
                controllerAs: 'vm'
            })
            .state('home.warn', {
                url: '/warn',
                templateUrl: 'app/main/tpl/warn.html',
                controller: 'WarnController',
                controllerAs: 'vm'
            })
            .state('home.info', {
                url: '/info',
                templateUrl: 'app/info/info.html',
                controller: 'InfoController',
                controllerAs: 'vm'
            })
            .state('home.task', {
                url: '/task',
                templateUrl: 'app/main/tpl/tasktpl.html',
                redirectTo: 'home.task.manage'
            })
            .state('home.task.manage', {
                url: '/task-manage',
                templateUrl: 'app/task/task-manage.html',
                controller: 'TaskManageController',
                controllerAs: 'vm'
            })
            .state('home.task.add', {
                url: '/add:_id',
                templateUrl: 'app/task/add.html',
                controller: 'TaskAddController',
                controllerAs: 'vm'
            })
            .state('home.project', {
                url: '/project',
                redirectTo: 'home.project.manage',
                templateUrl: 'app/main/tpl/projecttpl.html'
            })
            .state('home.project.manage', {
                url: '/project-manage',
                templateUrl: 'app/project/project-manage.html',
                controller: 'ProjectController',
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
                url: '/sign-in',
                templateUrl: 'app/user/sign.html',
                controller: 'SignInController',
                controllerAs: 'vm'
            })
            .state('home.user', {
                url: '/user',
                redirectTo: 'home.user.manage',
                templateUrl: 'app/main/tpl/usertpl.html'
            })
            .state('home.user.manage', {
                url: '/user-manage',
                templateUrl: 'app/user/user-manage.html',
                controller: 'UserManageController',
                controllerAs: 'vm'
            })
            .state('home.user.add', {
                url: '/add',
                templateUrl: 'app/user/add.html',
                controller: 'UserAddController',
                controllerAs: 'vm'
            });
            $urlRouterProvider.otherwise('/');
    }

})();
