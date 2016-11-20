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
            .state('home.work', {
                url: '/work',
                templateUrl: 'app/main/tpl/work.html',
                controller: 'WorkController',
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
            .state('home.task.detail', {
                url: '/detail',
                templateUrl: 'app/task/task.html',
                controller: 'TaskAddController',
                params: { task: null,readOnly:true},
                resolve: {
                    allProjects: function(ModelCURD) {
                        return ModelCURD.createCURDEntity('project').query({});
                    },
                    allUsers: function(ModelCURD) {
                        return ModelCURD.createCURDEntity('user').query({ role__gt: 1 });
                    }
                },
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
            .state('home.project.tasklist', {
                url: '/project-tasklist',
                params: { 'projectId': null },
                templateUrl: 'app/project/task-list.html',
                controller: 'ProjectTaskListController',
                controllerAs: 'vm'
            })
            .state('home.operate', {
                url: '/operate',
                templateUrl: 'app/main/tpl/operate.html',
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .state('home.operate.tasks', {
                url: '/operate/tasks',
                templateUrl: 'app/operate/tasks.html',
                controller: 'OperateController',
                resolve: {
                    allProjects: function(ModelCURD) {
                        return ModelCURD.createCURDEntity('project').query({});
                    }
                },
                controllerAs: 'vm'
            })
            .state('home.operate.journal', {
                url: '/operate/journal',
                templateUrl: 'app/operate/journal.html',
                controller: 'JournalController',
                controllerAs: 'vm'
            })
            .state('home.schedule', {
                url: '/schedule',
                templateUrl: 'app/main/tpl/schedule.html',
                controller: 'ScheduleController',
                resolve: {
                    projects: function(ModelCURD) {
                        return ModelCURD.createCURDEntity('project').query();
                    }
                },
                controllerAs: 'vm'
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
        $urlRouterProvider.otherwise('/home');
    }

})();
