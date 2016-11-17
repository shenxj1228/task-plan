(function() {
    'use strict';

    angular
        .module('projectTask')
        .factory('ModelCURD', ModelCURD)
        .factory('ToastDialog', ToastDialog)
        .factory('AuthenticationFactory', AuthenticationFactory)
        .factory('UserAuthFactory', UserAuthFactory)
        .factory('TokenInterceptor', TokenInterceptor)
        .factory('TaskOperate', TaskOperate);

    function ModelCURD($resource, servicehost, apiVersion) {
        var curd = {
            createCURDEntity: function(modelName) {
                return $resource(servicehost + apiVersion + modelName + '/:id', { id: '@_id' }, {
                    'update': { method: 'PUT' },
                    'get': { method: 'GET' },
                    'save': { method: 'POST' },
                    'delete': { method: 'DELETE' },
                    'queryPerPage': { method: 'GET', isArray: false },
                    'queryById': { method: 'GET', isArray: false },
                    'count': { method: 'GET', isArray: false, headers: { 'X-Count': true } }
                });

            }
        }
        return curd;
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
                if ($window.sessionStorage.token && $window.sessionStorage.Uid) {
                    this.isLogged = true;
                } else {
                    this.isLogged = false;
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
                    delete $window.sessionStorage.Uid;
                    delete $window.sessionStorage.userRole;
                    $state.go('signin');
                }
            },
            checkPwd: function(account, password) {
                var req = {
                    method: 'POST',
                    url: servicehost + '/login',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: { account: account, password: password, isCheckPwd: true }
                }
                return $http(req);
            }
        }

    }

    function TokenInterceptor($q, $window, $injector) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers['X-Access-Token'] = $window.sessionStorage.token;
                    config.headers['X-Key'] = $window.sessionStorage.Uid;
                    config.headers['X-State'] = $injector.get('$state').current.name;
                    config.headers['Content-Type'] = "application/json";
                }
                return config || $q.when(config);
            },
            response: function(response) {
                return response || $q.when(response);
            }
        };
    }

    function TaskOperate(ModelCURD, $rootScope, $window, moment, $mdDialog) {
        var self = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        self.TodoCount = function() {
            taskCURD.count({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime__lte: (moment().format('YYYY-MM-DD 00:00:00')) })
                .$promise.then(function(data) {
                    $rootScope.worksCount.value = data.count;
                    if (data.count === 0) {
                        $rootScope.worksCount.text = '';
                    } else if (data.count > 9) {
                        $rootScope.worksCount.text = '9+';
                    } else {
                        $rootScope.worksCount.text = data.count;
                    }

                });
        };
        self.update = function(task, cb) {
            if (!task.realStartTime || task.realStartTime === '') {
                task.realStartTime = moment().format('YYYY-MM-DD 00:00:00');
            }
            if (task.rate === 100) {
                task.realEndTime = moment().format('YYYY-MM-DD 00:00:00');
            }
            if(task.rate != 100&&(task.realEndTime||task.realEndTime!='')){
                task.realEndTime='';
            }
            taskCURD.update(task).$promise.then(function() {
                self.TodoCount();
                cb();
            });
        };
        self.delete = function(task, cb) {
            taskCURD.delete({id: task._id }).$promise.then(function() {
                self.TodoCount();
                cb();
            })
        };
        self.get = function(cb) {
            taskCURD.query({ dealAccount: $window.sessionStorage.account }).$promise.then(function(docs){
                cb(docs)});
        };
        self.getAll = function() {
            return taskCURD.query({});
        };
        self.showRateDialog = function(event, task, parentEl, cb) {
            $mdDialog.show({
                parent: parentEl,
                targetEvent: event,
                template: '<md-dialog >' +
                    '<md-dialog-content style="min-width:600px;min-height:100px;">' +
                    '<md-slider-container style="margin-top:20px;padding:0 20px;">' +
                    '<span>进度</span>' +
                    '<md-slider ng-model="rate" aria-label="进度"   flex md-discrete ng-readonly="readonly" min="0" max="100"></md-slider>' +
                    '<md-input-container>' +
                    '<input flex type="number" style="padding-left:0;" ng-model="rate"   aria-label="进度" min=0 step=1 max=100>' +
                    '</md-input-container>' +
                    '</md-slider-container>' +
                    '</md-dialog-content>' +
                    '<md-dialog-actions>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      取消' +
                    '    </md-button>' +
                    '    <md-button ng-click="updateRate()" class="md-primary">' +
                    '      确定' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                locals: {
                    task: task
                },
                controller: function($scope, $mdDialog, task) {
                    $scope.rate = task.rate ? task.rate : 0;
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                    $scope.updateRate = function() {
                        task.rate = $scope.rate;
                        self.update(task, function() {
                            $mdDialog.hide();
                            cb();
                        });
                    }
                }
            });
        };
        return self;

    }
    String.prototype.firstUpperCase = function() {
        return this.toString()[0].toUpperCase() + this.toString().slice(1);
    }

})();
