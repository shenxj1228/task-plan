(function() {

    angular
        .module('projectTask')
        .controller('UserController', UserController);

    function UserController() {
        var vm = this;
        vm.user = {
            name: '沈枭钧',
            user_id: '123',
            account: 'shenxj16541',
            avatar: ''
        }

    }




})();
