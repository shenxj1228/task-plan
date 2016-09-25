(function() {
    'use strict';
    angular.module('projectTask')
        //随窗口缩放
        .controller('MainController', MainController)
        .controller('InfoController',InfoController)
        .controller('WarnController',WarnController);

    /** @ngInject */
    function MainController($window, $rootScope, UserAuthFactory) {
        var vm=this;
        $rootScope.selfUser = {
            name: $window.sessionStorage.name,
            account: $window.sessionStorage.account,
            role: $window.sessionStorage.userRole,
            createTime: $window.sessionStorage.createTime
        };
        //定义标签页
        if ($rootScope.selfUser.role < 10) {
            vm.menuList = [{
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
        } else {
           vm.menuList = [{
                state: 'home.warn',
                name: '提醒'
            }, {
                state: 'home.schedule',
                name: '进度'
            }, {
                state: 'home.operate',
                name: '操作'
            }, {
                state: 'home.task',
                name: '任务管理'
            }, {
                state: 'home.info',
                name: '个人信息'
            }];
        }

        vm.signOut = function() {
            UserAuthFactory.signOut();
        }

    }
    function InfoController(UserAuthFactory,ModelCURD,$window,$log) {
        var vm=this;
        vm.signOut = function() {
            UserAuthFactory.signOut();
        }
        vm.changepwd=function(){
            var userCURD = ModelCURD.createCURDEntity('user');
            userCURD.update({ id: $window.sessionStorage.user }, {newpwd:'333'}, function() {
               console.log('密码修改完成!');
            }, function(err) {
                $log(err);
                console.log('密码重置失败', '发生异常');
            })
        }
    }
    function WarnController() {
        var vm=this;
        vm.test='';
    }
    

})();
