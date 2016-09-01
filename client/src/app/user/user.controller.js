(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController($http, ToastDialog, Modelcurl, servicehost,$timeout) {
        var vm = this;
        vm.user = {
            name: 'Moonkin',
            user_id: '123',
            account: 'moonkin16541',
            avatar: ''
        };
        vm.newUser = new Modelcurl.User();
        vm.turnBack = function($event) {
            $event.stopPropagation();
            $event.preventDefault();
            angular.element($event.currentTarget).toggleClass('flipped');
        };
        vm.changeStatus = function($event) {
            $event.stopPropagation();
            $event.preventDefault();
            angular.element($event.currentTarget).toggleClass('checked');
        };
        vm.addNewUser = function() {
            var req = {
                method: 'POST',
                url: servicehost + '/user',
                data: vm.newUser
            };
            var loadingInstance = ToastDialog.showLoadingDialog();

            vm.newUser.$save(function() {
                vm.newUser = new Modelcurl.User();
                loadingInstance.close();
                var successInstance=ToastDialog.showSuccessDialog();
                $timeout(function() {successInstance.close();}, 1200);
            }, function(err) {
                loadingInstance.close();
                var errorInstance=ToastDialog.showErrorDialog();
            });
        };

    }




})();
