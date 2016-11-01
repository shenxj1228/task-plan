(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('UserManageController', UserManageController)
        .controller('SignInController', SignInController);

    function UserManageController($log, ModelCURD, toastr, $scope, $timeout, $mdDialog) {
        var vm = this;
        var userCURD = ModelCURD.createCURDEntity('user');
        vm.searchText = '';
        vm.userList = [];
        vm.queryUsers = function() {
            getUserList();
        }
        vm.turnBack = function($event) {
            $event.stopPropagation();
            $event.preventDefault();
            angular.element($event.currentTarget).parents('.card').toggleClass('flipped');

        }
        vm.changeStatus = function(u) {
            userCURD.update({ id: u._id }, { status: u.status }, function(user) {
                u.status = user.status;
            }, function(err) {
                $log.error(err);
            });
        }
        vm.changeRole = function(u) {
            userCURD.update({ id: u._id }, { role: u.role }, function(user) {
                u.role = user.role;
                toastr.success('角色权限修改完成!');
            }, function(err) {
                toastr.error('角色权限修改失败', '发生异常');
                $log.error(err);
            })
        }
        vm.resetPassword = function(u) {
            userCURD.update({ id: u._id }, { newpwd: '111111' }, function() {
                toastr.success('密码重置完成!');
            }, function(err) {
                $log(err);
                toastr.error('密码重置失败', '发生异常');
            });
        }
        var searchtimer;
        $scope.$watch('vm.searchText', function(newvalue, oldvalue) {
            $timeout.cancel(searchtimer);
            if (newvalue != oldvalue) {
                searchtimer = $timeout(function() {
                    vm.userList = userCURD.query({ name__re: vm.searchText.split('').join('.*?') });
                }, 300);
            }
        });
        function getUserList(){
            vm.userList = userCURD.query();
        }
        vm.openAddDialog = function(ev) {
            $mdDialog.show({
                templateUrl: 'app/user/add.html',
                parent: angular.element('.right-panel'),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                controllerAs: 'vm',
                controller: function(ModelCURD, toastr,$log) {
                    var vm = this;
                    var userCURD = ModelCURD.createCURDEntity('user');
                    vm.newUser = new userCURD();
                    vm.newUser.role = 100;
                    vm.closeDialog=function(){
                        $mdDialog.cancel();
                    }
                    vm.addNewUser = function() {
                        var vm = this;
                        vm.newUser.$save(function(res) {
                            if (res.error != null) {
                                toastr.error(res.message, '新增用户失败');
                                return;
                            }
                            toastr.success('新增用户' + vm.newUser.name + '!', '新增用户成功!');
                            $mdDialog.cancel();
                            getUserList();
                        }, function(err) {
                            $log.error(err);
                            toastr.error('新增用户失败,请重试', '发生异常');
                            $mdDialog.cancel();
                        });
                    };
                }
            });
        }


    }

    function SignInController($log, $rootScope, toastr, ngProgressFactory, $window, $state, UserAuthFactory, AuthenticationFactory) {
        var vm = this;

        vm.signIn = function() {

            var account = vm.loginUser.account;
            var password = vm.loginUser.password;
            if (angular.isDefined(account) && angular.isDefined(password)) {
                UserAuthFactory.signIn(account, password).success(function(data) {
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user._id;
                    AuthenticationFactory.userRole = data.user.role;

                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user._id;
                    $window.sessionStorage.name = data.user.name;
                    $window.sessionStorage.account = data.user.account;
                    $window.sessionStorage.createTime = $window.moment(data.user.createTime).format('YYYY-MM-DD hh:mm:ss');
                    $window.sessionStorage.userRole = data.user.role;

                    $rootScope.selfUser = {
                        name: $window.sessionStorage.name,
                        account: $window.sessionStorage.account,
                        role: $window.sessionStorage.userRole,
                        createTime: $window.sessionStorage.createTime
                    };
                    $state.go("home.work");

                }).error(function(err) {
                    if (err) {
                        toastr.error(err.message);
                    } else {
                        toastr.error('连接失败！');
                    }

                });
            } else {
                toastr.error('无效的用户名或者密码！');
            }
        }
    }



})();
