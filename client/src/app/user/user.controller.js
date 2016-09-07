(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController($http, ToastDialog, Modelcurl, servicehost, $timeout, toastr, $window, $location, UserAuthFactory, AuthenticationFactory) {
        var vm = this;
        vm.newUser = new Modelcurl.User();
        vm.queryUsers = function() {
            vm.userList = [];
            vm.userList = Modelcurl.User.query();
        }

        vm.turnBack = function($event) {
            $event.stopPropagation();
            $event.preventDefault();
            angular.element($event.currentTarget).toggleClass('flipped');
        };
        vm.changeStatus = function($event, u) {
            $event.stopPropagation();
            $event.preventDefault();
            var uClone = angular.copy(u);
            uClone.status = !uClone.status;
            Modelcurl.User.update({ _id: u._id }, uClone, function(user) {
                u.status = user.status;
                toastr.success('用户状态变成' + (user.status ? '正常' : '禁用') + '!', '修改成功!');
            }, function(err) {
                toast = toastr.error('修改失败!');
            })
        };
        vm.addNewUser = function() {
            var loadingInstance = ToastDialog.showLoadingDialog();

            vm.newUser.$save(function() {
                loadingInstance.close();
                toastr.success('新增用户' + vm.newUser.name + '!', '新增用户成功!');
                vm.newUser = new Modelcurl.User();
            }, function(err) {
                console.log(err);
                loadingInstance.close();
                toast = toastr.error('新增用户失败!');
            });
        };
        vm.signIn = function() {
            var account = vm.loginUser.account;
            var password = vm.loginUser.password;
            if (account !== undefined && password !== undefined) {
                UserAuthFactory.signIn(account, password).success(function(data) {
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user.account;
                    AuthenticationFactory.userRole = data.user.role;

                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.account; // to fetch the user details on refresh
                    $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh

                    $location.path("/home");

                }).error(function(err) {
                    alert(err.message);
                });
            } else {
                alert('Invalid credentials');
            }
        }

        vm.signOut=function(){
            UserAuthFactory.signOut();
        }

    }




})();
