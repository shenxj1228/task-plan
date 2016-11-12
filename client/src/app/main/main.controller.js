(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('MainController', MainController)
        .controller('WorkController', WorkController)
        .controller('ScheduleController', ScheduleController)
        .controller('OperateController', OperateController);

    /** @ngInject */
    function MainController($window, servicehost, apiVersion, $http, $rootScope, UserAuthFactory, ModelCURD, moment, TaskOperate) {
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
        $rootScope.worksCount = {
            value: 0,
            text: ''
        }

        TaskOperate.TodoCount();
    }


    function WorkController($window, $state, $rootScope, ModelCURD, $mdDialog, moment, $log, TaskOperate) {
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
        vm.finishTask = function(event, task) {
            event.stopPropagation();
            event.preventDefault();
            var confirm = $mdDialog.prompt()
                .title('是否完成【' + task.taskName + '】?')
                .placeholder('备注')
                .ariaLabel('备注')
                .initialValue('')
                .targetEvent(event)
                .ok('是')
                .cancel('否');

            $mdDialog.show(confirm).then(function(result) {
                if (!task.realStartTime || task.realStartTime === '') {
                    task.realStartTime = moment().format('YYYY-MM-DD 00:00:00');
                }
                task.remark = result;
                task.realEndTime = moment().format('YYYY-MM-DD 00:00:00');
                task.rate = 100;
                TaskOperate.update(task, function() { $state.reload(); });
            }, function() {

            });
        }
        vm.gotoTaskPage = function(task) {
            $state.go("home.task.detail", { _id: task._id }, { inherit: false });
        }
        vm.viewTaskDetail = function(task) {
            $mdDialog.show({
                templateUrl: 'app/task/task.html',
                parent: angular.element('.right-panel'),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: { task: task },
                controllerAs: 'vm',
                controller: function(task, moment, ModelCURD) {
                    var vm = this;
                    var userCURD = ModelCURD.createCURDEntity('user');
                    var projectCURD = ModelCURD.createCURDEntity('project');
                    vm.allUsers = userCURD.query({ account: task.dealAccount });
                    vm.allProjects = projectCURD.query({ _id: task.projectId });
                    task.planStartTime = moment(task.planStartTime, 'YYYY-MM-DD').toDate();
                    task.planEndTime = moment(task.planEndTime, 'YYYY-MM-DD').toDate();
                    vm.isReadonly = true;
                    vm.newTask = task;
                }
            });
        }
        vm.showTaskDescBtn = function(event, task) {
            event.stopPropagation();
            event.preventDefault();
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('.right-panel')))
                .clickOutsideToClose(true)
                .title('【' + task.taskName + '】')
                .htmlContent('<div>' + (task.taskDesc.trim() === '') ? '<grey>描述：</grey><em>null</em>' : '<grey>描述：</grey>' + task.taskDesc.replace(/\n/ig, '<br/>') + '</div>')
                .ariaLabel('任务描述')
                .ok('关闭')
                .targetEvent(event)
            );
        }
        vm.showUpdateRateDialog = function(event, task) {
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
                    task: task
                },
                controller: UpdateRateDialogController
            });

            function UpdateRateDialogController($scope, $mdDialog, task) {
                $scope.rate = task.rate ? task.rate : 0;
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }
                $scope.updateRate = function() {
                    task.rate = $scope.rate;
                    TaskOperate.update(task, function() { $state.reload(); });
                }
            }
        }
        vm.getExtendedWorks();
        vm.getTodayWorks();
        vm.getTomorrowWorks();


    }

    function ScheduleController(projects) {
        var vm = this;
        vm.projects = projects;
        angular.forEach(vm.projects, function(value) {
            if (value.isactive === true) {
                vm.selectedProject = value;
                return;
            }
        });

    }

    function OperateController(ModelCURD, $mdDialog, $window, toastr, $state, TaskOperate) {
        var vm = this;
        vm.selected = [];
        vm.tasks=TaskOperate.get();
        vm.editTask = function(task) {
            $state.go("home.task.detail", { _id: task._id }, { inherit: false });
        }
        vm.taskDelete = function(ev, task) {
            var confirm = $mdDialog.confirm()
                .title('是否删除【' + task.dh + '】?')
                .textContent(task.taskName)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('确定')
                .cancel('取消');
            $mdDialog.show(confirm).then(function() {
                TaskOperate.delete(task, function() {
                    toastr.success('任务【' + task.taskName + '】删除成功!');
                    vm.tasks=TaskOperate.get();
                })
            });
        }
        vm.taskFinish = function() {
            var finishWorkArray = [];
            vm.tasks.forEach(function(element) {
                if (element.selected && element.selected === true) {
                    finishWorkArray.push(element);
                }

            });
            if (finishWorkArray.length < 1) {
                return;
            }
            var confirm = $mdDialog.prompt()
                .title('是否完成这些任务?')
                .placeholder('备注')
                .ariaLabel('备注')
                .initialValue('')
                .targetEvent(event)
                .ok('是')
                .cancel('否');
            $mdDialog.show(confirm).then(function(desc) {
                var parentEl = angular.element(document.querySelector('.right-panel'));
                $mdDialog.show({
                    parent: parentEl,
                    targetEvent: event,
                    template: '<md-dialog aria-label="UpdateProgress" >' +
                        '<span style="margin-top: 10px;text-align: center;color: #888;">进度：{{vm.done}}/{{vm.total}}</span>' +
                        '<md-dialog-content style="min-width:600px;min-height:100px;">' +
                        '<md-progress-linear style="margin:40px 0;padding:0 20px;" md-mode="determinate" value="{{vm.determinateValue}}"></md-progress-linear>' +
                        '</md-dialog-actions>' +
                        '</md-dialog>',
                    locals: {
                        obj: { works: finishWorkArray, desc: desc,parent:vm }
                    },
                    controller: UpdateProgressController,
                    controllerAs: 'vm'
                });

                function UpdateProgressController(obj) {
                    var parent=obj.parent;
                    var vm = this;

                    vm.determinateValue = 0;
                    vm.done = 0;
                    vm.total = obj.works.length;
                    obj.works.forEach(function(element, index) {
                        element.rate = 100;
                        element.desc = obj.desc;
                        TaskOperate.update(element, function() {
                            vm.determinateValue += 100 / obj.works.length;
                            vm.done++;
                            if (index === obj.works.length - 1) {
                                $mdDialog.hide();
                                toastr.success('【' + obj.works.length + '】个任务完成!');
                                parent.tasks=TaskOperate.get();
                            }

                        });

                    });
                }

            });
        }


    }


})();
