(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('MainController', MainController)
        .controller('WorkController', WorkController)
        .controller('ScheduleController', ScheduleController);

    /** @ngInject */
    function MainController($window, $rootScope, UserAuthFactory, ModelCURD, moment) {
        var vm = this;
        $rootScope.selfUser = {
            name: $window.sessionStorage.name,
            account: $window.sessionStorage.account,
            role: $window.sessionStorage.userRole,
            createTime: $window.sessionStorage.createTime
        };
        //定义标签页
        vm.menuList = [{
            state: 'home.work',
            name: '工作内容'
        }, {
            state: 'home.schedule',
            name: '进度'
        }, {
            state: 'home.operate',
            name: '操作'
        }, {
            state: 'home.info',
            name: '个人信息'
        }];
        //给管理者增加菜单
        if ($rootScope.selfUser.role < 10) {
            vm.menuList = [{
                state: 'home.project',
                name: '项目管理'
            }, {
                state: 'home.task',
                name: '任务管理'
            }, {
                state: 'home.user',
                name: '用户管理'
            }];
        }

        vm.signOut = function() {
            UserAuthFactory.signOut();
        }
        var taskCURD = ModelCURD.createCURDEntity('task');
        taskCURD.count({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime__lte: (moment().format('YYYY-MM-DD 00:00:00')) })
            .$promise.then(function(data) {
                if (data.count === 0) {
                    vm.worksCount = '';
                } else if (data.count > 9) {
                    vm.worksCount = '9+';
                } else {
                    vm.worksCount = data.count;
                }

            });

    }


    function WorkController($window, $state, $rootScope, ModelCURD, $mdDialog, moment, $log) {
        var vm = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime__lte: (moment().subtract(1, 'd').format('YYYY-MM-DD 00:00:00')) })
            .$promise.then(function(data) {
                vm.ExWorkLoadingEnd = true
                vm.extendedWorks = data;
            });
        taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime: (moment().format('YYYY-MM-DD 00:00:00')) })
            .$promise.then(function(data) {
                vm.TDLoadingEnd = true;
                vm.todayWorks = data;
            });
        taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime: (moment().add(1, 'd').format('YYYY-MM-DD 00:00:00')) })
            .$promise.then(function(data) {
                vm.TWLoadingEnd = true;
                vm.tomorrowWorks = data;
            });

        vm.finishTask = function(event, work) {
            event.stopPropagation();
            event.preventDefault();
            var confirm = $mdDialog.prompt()
                .title('是否完成【' + work.taskName + '】?')
                .placeholder('备注')
                .ariaLabel('备注')
                .initialValue('')
                .targetEvent(event)
                .ok('是')
                .cancel('否');

            $mdDialog.show(confirm).then(function(result) {
                if (!work.realStartTime || work.realStartTime === '') {
                    work.realStartTime = moment().format('YYYY-MM-DD 00:00:00');
                }
                work.remark = result;
                work.realEndTime = moment().format('YYYY-MM-DD 00:00:00');
                work.rate = 100;
                updateTask(work);
            }, function() {

            });
        }
        vm.gotoTaskPage = function(event, work) {
            event.stopPropagation();
            event.preventDefault();
            $state.go("home.task.detail", { _id: work._id }, { inherit: false });
        }
        vm.showTaskDescBtn = function(event, work) {
            event.stopPropagation();
            event.preventDefault();
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('.right-panel')))
                .clickOutsideToClose(true)
                .title('【' + work.taskName + '】')
                .htmlContent('<div>' + work.taskDesc.replace(/\n/ig, '<br/>') + '</div>')
                .ariaLabel('任务描述')
                .ok('关闭')
                .targetEvent(event)
            );
        }
        vm.showUpdateRateDialog = function(event, work) {
            var parentEl = angular.element(document.querySelector('.right-panel'));
            $mdDialog.show({
                parent: parentEl,
                targetEvent: event,
                template: '<md-dialog >' +
                    '<md-dialog-content style="min-width:600px;min-height:100px;">' +
                    '<md-slider-container style="margin-top:30px;">' +
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
                    work: work
                },
                controller: UpdateRateDialogController
            });

            function UpdateRateDialogController($scope, $mdDialog, work) {
                $scope.rate = work.rate ? work.rate : 0;
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }
                $scope.updateRate = function() {
                    if (!work.realStartTime || work.realStartTime === '') {
                        work.realStartTime = moment().format('YYYY-MM-DD 00:00:00');
                    }
                    if ($scope.rate === 100) {
                        work.realEndTime = moment().format('YYYY-MM-DD 00:00:00');
                    }
                    work.rate = $scope.rate;

                    updateTask(work);
                }
            }
        }

        function updateTask(work) {
            taskCURD.update(work).$promise.then(function(data) {
                $state.reload();
            })
        }
    }

    function ScheduleController(projects) {
        var vm = this;
        vm.projects = projects;
        angular.forEach(vm.projects, function(value, key) {
            if (value.isactive === true) {
                vm.selectedProject = value;
                return;
            }
        });

    }

})();
