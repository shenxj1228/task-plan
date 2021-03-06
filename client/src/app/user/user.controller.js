(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('UserManageController', UserManageController)
        .controller('SignInController', SignInController)
        .filter('avatarUrl', avatarUrl);

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
                    getUserList({ name__re: vm.searchText.split('').join('.*?') });
                }, 300);
            }
        });

        function getUserList(search) {
            vm.userList=[];
            if (!search || typeof search != 'object') {
                search = {}
            }
            vm.userList = userCURD.query(search);
        }
        vm.openAddDialog = function(ev) {
            $mdDialog.show({
                templateUrl: 'app/user/add.html',
                parent: angular.element('body'),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                controllerAs: 'vm',
                controller: function(ModelCURD, toastr, $log) {
                    var vm = this;
                    var userCURD = ModelCURD.createCURDEntity('user');
                    vm.newUser = new userCURD();
                    vm.newUser.role = 100;
                    vm.closeDialog = function() {
                        $mdDialog.cancel();
                    }
                    vm.addNewUser = function() {
                        $mdDialog.cancel();
                        vm.newUser.$save(function(res) {
                            if (res.error != null) {
                                toastr.error(res.message, '新增用户失败');
                                return;
                            }
                            getUserList();
                            toastr.success('新增用户' + vm.newUser.name + ' 默认密码：111111', '新增用户成功!');
                            
                        }, function(err) {
                            $log.error(err);
                            toastr.error('新增用户失败,请重试', '发生异常');
                        });
                    };
                }
            });
        }


    }

    function SignInController($log, $rootScope, toastr, ngProgressFactory, $window, $state, UserAuthFactory, AuthenticationFactory, $timeout) {
        var vm = this;
        vm.logining = false;
        vm.signIn = function() {
            var account = vm.loginUser.account;
            var password = vm.loginUser.password;
            if (angular.isDefined(account) && angular.isDefined(password)) {
                vm.logining = true;
                var startTime = new Date();
                UserAuthFactory.signIn(account, password).success(function(data) {
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user._id;
                    AuthenticationFactory.userRole = data.user.role;
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.Uid = data.user._id;
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
                    var endTime = new Date();
                    var timeout = endTime - startTime;
                    if (timeout < 1000) {
                        timeout = 1000 - timeout;
                    }
                    $timeout(function() {
                        $state.go("home");
                    }, timeout);
                }).error(function(err) {
                    var endTime = new Date();
                    var timeout = endTime - startTime;
                    if (timeout < 1000) {
                        timeout = 1000 - timeout;
                    }
                    $timeout(function() {
                        vm.logining = false;
                        if (err) {
                            toastr.error(err.message);
                        } else {
                            toastr.error('连接失败！');
                        }
                    }, timeout);

                });
            } else {

                toastr.error('无效的用户名或者密码！');

            }
        }
    }

    function avatarUrl(servicehost, $window) {
        return function() {
            return 'url(' + servicehost + '/user/' + $window.sessionStorage.Uid + '/avatar' + '?' + new Date().getTime() + ')';
        };
    }

})();
