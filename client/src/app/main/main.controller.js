(function() {
    'use strict';
    angular.module('projectTask')
        //随窗口缩放
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, UserAuthFactory) {

        //定义标签页
        $scope.menuList = [{
            state: 'home.warn',
            name: '提醒'
        }, {
            state: 'home.schedule',
            name: '进度'
        }, {
            state: 'home.operate',
            name: '操作'
        }, {
            state: 'home.project',
            name: '项目管理'
        }, {
            state: 'home.task',
            name: '任务管理'
        }, {
            state: 'home.user',
            name: '用户管理'
        }, {
            state: 'home.info',
            name: '个人信息'
        }];
        $scope.signOut = function() {
            UserAuthFactory.signOut();
        }

    }

})();
