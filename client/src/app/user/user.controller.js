(function() {

    angular
        .module('projectTask')
        .controller('UserController',UserController);

    function UserController($uibModal) {
        var vm = this;
        vm.user = {
            name: '沈枭钧',
            user_id: '123',
            account: 'shenxj16541',
            avatar: ''
        }
        vm.openAddUserPage = function() {
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/user/add.html',
                controller: 'UserController',
                controllerAs: 'vm',
                resolve: {
                    items: function() {
                        return vm.user;
                    }
                }
            });

            
        }

    }




})();
