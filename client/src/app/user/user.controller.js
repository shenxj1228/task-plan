(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController($http,servicehost) {
        var vm = this;
        vm.user = {
            name: 'Moonkin',
            user_id: '123',
            account: 'moonkin16541',
            avatar: ''
        };
        vm.newUser = {
            name: '',
            account: ''
        };
        vm.turnBack = function($event) {
            $event.stopPropagation();
            $event.preventDefault();
            $($event.currentTarget).toggleClass('flipped');
        };
        vm.changeStatus = function($event) {
            $event.stopPropagation();
            $event.preventDefault();
            $($event.currentTarget).toggleClass('checked');
        };
        vm.addNewUser = function() {
            var req = {
                method: 'POST',
                url: servicehost + '/user',
                data: vm.newUser
            };
            $http(req).then(function(res) {
                console.log('success');
            }, function(err) {
                console.log(err);
            });

            vm.newUser = { name: '', account: '' };
        };

    }




})();
