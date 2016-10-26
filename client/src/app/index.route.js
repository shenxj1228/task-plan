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
                redirectTo: 'home.work',
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
            .state('home.task.add', {
                url: '/add:_id',
                templateUrl: 'app/task/add.html',
                controller: 'TaskAddController',
                resolve: {
                    task: function(ModelCURD, $stateParams, $window) {
                        var taskCURD = ModelCURD.createCURDEntity('task');
                        var task={};
                        if ($stateParams._id != '') {
                          return  taskCURD.queryById({ id: $stateParams._id }).$promise.then(function(doc) {
                                task = doc;
                                task.planStartTime = $window.moment(task.planStartTime).local().toDate();
                                task.planEndTime = $window.moment(task.planEndTime).local().toDate();
                                return task;

                            });
                        } else {
                            task = new taskCURD();
                            task.dealAccount = $window.sessionStorage.account;
                            task.planStartTime = $window.moment(new Date(), 'YYYY-MM-DD').toDate();
                            task.planEndTime = $window.moment(new Date(), 'YYYY-MM-DD').toDate();
                            return task;
                        }
                    },
                    usefulProjects: function(ModelCURD) {
                        var projectCURD = ModelCURD.createCURDEntity('project');

                        return projectCURD.query({ rate__ne: 100 });
                    },
                    usefulUsers: function(ModelCURD) {
                        var userCURD = ModelCURD.createCURDEntity('user');
                        return userCURD.query({ status: true, role__gt: 1 });
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
