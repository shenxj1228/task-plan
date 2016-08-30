(function() {
    'use strict';
    angular.module('projectTask')
        //随窗口缩放
        .directive('resizable', function($window) {
            return function($scope) {
                $scope.initializeWindowSize = function() {
                    $scope.windowHeight = $window.innerHeight;
                    return $scope.windowWidth = $window.innerWidth;
                };
                $scope.initializeWindowSize();
                return angular.element($window).bind('resize', function() {
                    $scope.initializeWindowSize();
                    return $scope.$apply();
                });
            };
        })
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController() {
        var vm = this;
        //定义标签页
        vm.menuList = [{
            state: 'home.warn',
            name: '提醒'
        }, {
            state: 'home.operate',
            name: '操作'
        }, {
            state: 'home.schedule',
            name: '进度'
        }, {
            state: 'home.info',
            name: '个人信息'
        }];
       

    }
})();
