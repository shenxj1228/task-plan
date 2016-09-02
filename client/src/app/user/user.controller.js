(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController($http, ToastDialog, Modelcurl, servicehost, $timeout, toastr) {
        var vm = this;
        vm.newUser = new Modelcurl.User();
        vm.managePageInit = function() {
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
            var req = {
                method: 'POST',
                url: servicehost + '/user',
                data: vm.newUser
            };
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

    }




})();
