(function() {
    'use strict';

    angular
        .module('projectTask')
        .factory('Modelcurl', Modelcurl)
        .factory('ToastDialog', ToastDialog)
        .factory('AuthenticationFactory', AuthenticationFactory)
        .factory('UserAuthFactory', UserAuthFactory)
        .factory('TokenInterceptor', TokenInterceptor);

    function Modelcurl($resource, servicehost) {
        var models = ['user', 'project', 'task', 'journal'],
            modelsObj = new Object;
        models.forEach(function(element) {
            modelsObj[element.firstUpperCase()] = $resource(servicehost + '/api/v1/' + element + '/:id', { id: '@_id' }, {
                'update': { method: 'PUT' }
            });
            modelsObj[element.firstUpperCase()].getCount=$resource(servicehost + '/api/v1/' + element + '/count/:id', { id: '@_id' }, {
                'queryBy': { method: 'GET' }
            });
        });
        return modelsObj;
    }


    function ToastDialog($uibModal) {
        var baseDialog = {
            animation: true,
            template: '',
            size: 'sm',
            windowTopClass: 'fixed-center dialog-lg',
            backdrop: 'static'
        }
        var loadingDialog = {},
            successDialog = {},
            errorDialog = {};
        angular.copy(baseDialog, loadingDialog);
        angular.copy(baseDialog, successDialog);
        angular.copy(baseDialog, errorDialog);

        loadingDialog.template = '<div class="loading-dialog dialog"><span class="content">加载中</span></div>';
        successDialog.template = '<div class="success-dialog dialog"><div class="content"><i class="material-icons">done</i><span>成功</span></div></div>';
        successDialog.backdrop = 'true';
        errorDialog.template = '<div class="error-dialog dialog"><div class="content"><i class="material-icons">highlight_off</i><span>失败</span></div></div>';
        errorDialog.backdrop = 'true';
        return {
            showLoadingDialog: function() {
                return $uibModal.open(loadingDialog);
            },
            showSuccessDialog: function() {
                return $uibModal.open(successDialog);
            },
            showErrorDialog: function() {
                return $uibModal.open(errorDialog);
            }
        }
    }

    function AuthenticationFactory($window) {
        var auth = {
            isLogged: false,
            check: function() {
                if ($window.sessionStorage.token && $window.sessionStorage.user) {
                    this.isLogged = true;
                } else {
                    this.isLogged = false;
                    delete this.user;
                }
            }
        }
        return auth;
    }

    function UserAuthFactory($window, $state, $http, AuthenticationFactory, servicehost) {
        return {
            signIn: function(account, password) {
                var req = {
                    method: 'POST',
                    url: servicehost + '/login',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: { account: account, password: password }
                }
                return $http(req).success(function() { AuthenticationFactory.check(); });
            },
            signOut: function() {
                if (AuthenticationFactory.isLogged) {
                    AuthenticationFactory.isLogged = false;
                    delete AuthenticationFactory.user;
                    delete AuthenticationFactory.userRole;
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.user;
                    delete $window.sessionStorage.userRole;
                    $state.go('signin');
                }
            }
        }
    }

    function TokenInterceptor($q, $window) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers['X-Access-Token'] = $window.sessionStorage.token;
                    config.headers['X-Key'] = $window.sessionStorage.user;
                    config.headers['Content-Type'] = "application/json";
                }
                return config || $q.when(config);
            },
            response: function(response) {
                return response || $q.when(response);
            }
        };
    }





    String.prototype.firstUpperCase = function() {
        return this.toString()[0].toUpperCase() + this.toString().slice(1);
    }

})();
