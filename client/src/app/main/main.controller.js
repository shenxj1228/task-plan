(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('MainController', MainController)
        .controller('WorkController', WorkController)
        .controller('ScheduleController', ScheduleController)
        .controller('OperateController', OperateController);

    /** @ngInject */
    function MainController($window, servicehost, apiVersion, $http, $rootScope, UserAuthFactory, ModelCURD, moment) {
        var vm = this;
        var req = {
            method: 'GET',
            url: servicehost + '/menus'
        }
        $http(req).success(function(res) {
            vm.menuList = res.menuList;
        });

        $rootScope.selfUser = {
            name: $window.sessionStorage.name,
            account: $window.sessionStorage.account,
            role: $window.sessionStorage.userRole,
            createTime: $window.sessionStorage.createTime
        };
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
        vm.getExtendedWorks = function() {
            taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime__lte: (moment().subtract(1, 'd').format('YYYY-MM-DD 00:00:00')) })
                .$promise.then(function(data) {
                    vm.ExWorkLoadingEnd = true
                    vm.extendedWorks = data;
                    if (data.length === 0) {
                        vm.exWorksCount = '';
                    } else if (data.count > 9) {
                        vm.exWorksCount = '9+';
                    } else {
                        vm.exWorksCount = data.length;
                    }
                });
        }
        vm.getTodayWorks = function() {
            taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime: (moment().format('YYYY-MM-DD 00:00:00')) })
                .$promise.then(function(data) {
                    vm.TDLoadingEnd = true;
                    vm.todayWorks = data;
                    if (data.length === 0) {
                        vm.todayWorksCount = '';
                    } else if (data.count > 9) {
                        vm.todayWorksCount = '9+';
                    } else {
                        vm.todayWorksCount = data.length;
                    }
                });
        }
        vm.getTomorrowWorks = function() {
            taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime: (moment().add(1, 'd').format('YYYY-MM-DD 00:00:00')) })
                .$promise.then(function(data) {
                    vm.TWLoadingEnd = true;
                    vm.tomorrowWorks = data;
                    if (data.length === 0) {
                        vm.tomorrowWorksCount = '';
                    } else if (data.count > 9) {
                        vm.tomorrowWorksCount = '9+';
                    } else {
                        vm.tomorrowWorksCount = data.length;
                    }
                });
        }
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
                .htmlContent('<div>' + (work.taskDesc.trim() === '') ? '<grey>描述：</grey><em>null</em>' : '<grey>描述：</grey>' + work.taskDesc.replace(/\n/ig, '<br/>') + '</div>')
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

    function OperateController(ModelCURD, $mdDialog, $window) {
        var vm = this;
        vm.selected = [];
        var taskCURD = ModelCURD.createCURDEntity('task');
        getTasks(taskCURD);

        vm.taskDelete = function(task) {
            taskCURD.delete({ id: task._id }).$promise.then(function() {
                toastr.success('任务【' + task.taskName + '】删除成功!');
                getTasks();
            });
        }
        vm.taskFinish = function() {
            var finishIdArray = [],
                noStartTimeIdArray = [];
            vm.tasks.forEach(function(element, index) {
                if (element.selected && element.selected === true) {
                    finishIdArray.push(element._id);
                    if (!element.realStartTime||element.realStartTime.trim() === '') {
                        noStartTimeIdArray.push(element._id);
                    }
                }

            });
            var finishIdArrayString = finishIdArray.join(',');
            var noStartTimeIdArrayString = noStartTimeIdArray.join(',');
            var confirm = $mdDialog.prompt()
                .title('是否完成这些任务?')
                .placeholder('备注')
                .ariaLabel('备注')
                .initialValue('')
                .targetEvent(event)
                .ok('是')
                .cancel('否');
                console.log(finishIdArrayString);
                console.log(noStartTimeIdArrayString);
            $mdDialog.show(confirm).then(function(result) {
                taskCURD.update({ _id__in: noStartTimeIdArrayString }, { realStartTime: moment().format('YYYY-MM-DD 00:00:00') }).$pomise.then(function() {
                    taskCURD.update({ _id__in: finishIdArrayString }, { rate: 100, realEndTime: moment().format('YYYY-MM-DD 00:00:00'), remark: result }).$pomise.then(function() {
                        toastr.success('【' + finishIdArrayString.length + '】项任务完成!');
                    });
                });
            }, function() {

            });



        }

        function getTasks(taskCURD) {
            vm.tasks = taskCURD.query({ dealAccount: $window.sessionStorage.account });
        }
    }

})();
