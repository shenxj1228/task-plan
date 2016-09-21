(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController($log, $http, ToastDialog, ModelCURD,$rootScope, $window,servicehost, $timeout, toastr, $window, $state, UserAuthFactory, AuthenticationFactory) {
        var vm = this;
        var userCURD = ModelCURD.createCURDEntity('user');
        vm.newUser = new userCURD();
        vm.searchText = '';
        vm.queryUsers = function() {
            vm.userList = [];
            vm.userList = userCURD.query();
        }

        vm.turnBack = function($event, u) {
            $event.stopPropagation();
            $event.preventDefault();
            angular.element($event.currentTarget).parents('.card').toggleClass('flipped');
            if (angular.element($event.currentTarget).parents('.card').hasClass('flipped')) {

            }
        };
        vm.changeStatus = function($event, u) {
            $event.stopPropagation();
            $event.preventDefault();
            var uClone = angular.copy(u);
            uClone.status = !uClone.status;
            userCURD.update({ _id: u._id }, uClone, function(user) {
                u.status = user.status;
                toastr.success('用户状态变成' + (user.status ? '正常' : '禁用') + '!', '修改成功!');
            }, function(err) {
                toastr.error('修改失败!');
            })
        };

        vm.addNewUser = function() {
            var loadingInstance = ToastDialog.showLoadingDialog();

            vm.newUser.$save(function(res, headers) {
                loadingInstance.close();
                if (res.error != null) {
                    toastr.error(res.message, '新增用户失败');
                    return;
                }
                toastr.success('新增用户' + vm.newUser.name + '!', '新增用户成功!');
                vm.newUser = new userCURD();
            }, function(err) {
                $log.debug(err);
                loadingInstance.close();
                toastr.error('新增用户失败,请重试', '发生异常');
            });
        };
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
                    $window.sessionStorage.name=data.user.name;
                    $window.sessionStorage.account=data.user.account;
                    $window.sessionStorage.createTime=moment(data.user.createTime).format('YYYY-MM-DD hh:mm:ss');
                    $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh

                    $rootScope.selfUser={
                        name:$window.sessionStorage.name,
                        account:$window.sessionStorage.account,
                        role:$window.sessionStorage.userRole,
                        createTime:$window.sessionStorage.createTime
                    };
                     
                    $state.go("home.warn");

                }).error(function(err) {
                    toastr.error(err.message);
                });
            } else {
                toastr.error('Invalid credentials');
            }
        }
         
        

    }




})();
