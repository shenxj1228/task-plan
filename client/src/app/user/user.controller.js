(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController($log, $http, ToastDialog, Modelcurl, servicehost, $timeout, toastr, $window, $location, UserAuthFactory, AuthenticationFactory) {
        var vm = this;
        vm.newUser = new Modelcurl.User();
        vm.queryUsers = function() {
            vm.userList = [];
            vm.userList = Modelcurl.User.query();
        }

        vm.turnBack = function($event, u) {
            $event.stopPropagation();
            $event.preventDefault();
            angular.element($event.currentTarget).parents('.card').toggleClass('flipped');
            if (angular.element($event.currentTarget).parents('.card').hasClass('flipped')){
                u.projectCount = Modelcurl.Project.getCount.queryBy({ projectName: 'V1' });
            }
            console.log(u.projectCount);
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
                toastr.error('修改失败!');
            })
        };

        vm.addNewUser = function() {
            var loadingInstance = ToastDialog.showLoadingDialog();

            vm.newUser.$save(function() {
                loadingInstance.close();
                toastr.success('新增用户' + vm.newUser.name + '!', '新增用户成功!');
                vm.newUser = new Modelcurl.User();
            }, function(err) {
                $log.debug(err);
                loadingInstance.close();
                toastr.error('新增用户失败!');
            });
        };
        vm.signIn = function() {
            var account = vm.loginUser.account;
            var password = vm.loginUser.password;
            if (angular.isDefined(account) && angular.isDefined(password)) {
                UserAuthFactory.signIn(account, password).success(function(data) {
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user.account;
                    AuthenticationFactory.userRole = data.user.role;

                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.account; // to fetch the user details on refresh
                    $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh

                    $location.path("/home/warn");

                }).error(function(err) {
                    toastr.error(err.message);
                });
            } else {
                toastr.error('Invalid credentials');
            }
        }

        vm.signOut = function() {
            UserAuthFactory.signOut();
        }

    }




})();
