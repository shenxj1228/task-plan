(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController($log, $http, ToastDialog, Modelcurl,$rootScope, $window,servicehost, $timeout, toastr, $window, $state, UserAuthFactory, AuthenticationFactory) {
        var vm = this;
        var userCurl = Modelcurl.createCurlEntity('user');
        vm.newUser = new userCurl();
        vm.searchText = '';
        vm.queryUsers = function() {
            vm.userList = [];
            vm.userList = userCurl.query();
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
            userCurl.update({ _id: u._id }, uClone, function(user) {
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
                vm.newUser = new userCurl();
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
                    $window.sessionStorage.user = data.user._id; // to fetch the user details on refresh
                    $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh

                    $rootScope.selfUser={
                        name:data.user.name,
                        account:data.user.account,
                        createTime:moment(data.user.createTime).format('YYYY-MM-DD hh:mm:ss')
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
