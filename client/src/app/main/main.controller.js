(function() {
    'use strict';
    angular.module('projectTask')
        //随窗口缩放
        .controller('MainController', MainController)
        .controller('InfoController', InfoController)
        .controller('WarnController', WarnController);

    /** @ngInject */
    function MainController($window, $rootScope, UserAuthFactory) {
        var vm = this;
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

    function InfoController(UserAuthFactory, ModelCURD, $window, $log, $mdDialog) {
        var vm = this;
        vm.signOut = function() {
            UserAuthFactory.signOut();
        }
        vm.changepwd = function(ev) {
            $mdDialog.show({
                templateUrl: 'app/user/changepwd.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                openFrom: angular.element(document.querySelector('#btnChgPwd')),
                closeTo: angular.element(document.querySelector('body')),
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {
                    user: {
                        account: $window.sessionStorage.account,
                        id: $window.sessionStorage.user
                    }
                },
                controller: function DialogController($scope, $mdDialog, ModelCURD, user, UserAuthFactory, toastr) {
                    $scope.submitFormChgPwd = function() {
                        UserAuthFactory.checkPwd(user.account, $scope.inputOldPwd).success(function() {
                            var userCURD = ModelCURD.createCURDEntity('user');
                            userCURD.update({ id: user.id }, { newpwd: $scope.inputNewPwd }, function() {
                                toastr.success('密码修改成功');
                                $mdDialog.hide();
                            }, function(err) {
                                $log(err);
                                toastr.error('密码重置失败', '发生异常');
                            })
                        }).error(function(err) {
                            toastr.error('旧密码验证失败');
                        });
                    }
                }
            });
        }


    }

    function WarnController() {
        var vm = this;
        vm.test = '';
    }


})();
