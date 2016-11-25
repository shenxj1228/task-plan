(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('MainController', MainController)
        .controller('WorkController', WorkController)
        .controller('ScheduleController', ScheduleController)
        .controller('OperateController', OperateController)
        .controller('HomeController', HomeController)
        .controller('JournalController', JournalController);

    /** @ngInject */
    function MainController($window, servicehost, apiVersion, $http, $rootScope, UserAuthFactory, ModelCURD, moment, TaskOperate) {
        var vm = this;
        vm.menuLoading = false;
        var req = {
            method: 'GET',
            url: servicehost + '/menus'
        }
        $http(req).success(function(res) {
            vm.menuList = res.menuList;
            vm.menuLoading = true;
        });
        $rootScope.avatarImg = servicehost + '/user/' + $window.sessionStorage.Uid + '/avatar';

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


    function WorkController($window, $state, $rootScope, ModelCURD, $mdDialog, moment, $log, TaskOperate, $document) {
        var vm = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        var tabReflash = {};
        vm.getExtendedWorks = function() {
            taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime__lte: (moment().subtract(1, 'd').format('YYYY-MM-DD 00:00:00')) })
                .$promise.then(function(data) {
                    vm.ExWorkLoadingEnd = true;
                    vm.extendedWorks = data;
                    tabReflash = vm.getExtendedWorks;
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
                    tabReflash = vm.getTodayWorks;
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
                    vm.TWLoadingEnd = vm.getTomorrowWorks;
                    vm.tomorrowWorks = data;
                    tabReflash = vm.getTomorrowWorks;
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
                task.remark = result;
                task.rate = 100;
                TaskOperate.update(task, function() { $state.reload(); });
            });
        }
        vm.gotoTaskPage = function(task) {
            $state.go("home.task.detail", { task: task, readOnly: false });
        }
        vm.viewTaskDetail = function(task) {
            $mdDialog.show({
                templateUrl: 'app/task/task.html',
                parent: angular.element('body'),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: { task: task },
                controllerAs: 'vm',
                controller: function(task, moment, ModelCURD) {
                    var vm = this;
                    var userCURD = ModelCURD.createCURDEntity('user');
                    var projectCURD = ModelCURD.createCURDEntity('project');
                    vm.allUsers = userCURD.query({});
                    vm.allProjects = projectCURD.query({});
                    task.planStartTime = moment(task.planStartTime).toDate();
                    task.planEndTime = moment(task.planEndTime).toDate();
                    vm.isReadonly = true;
                    vm.task = task;
                }
            });
        }
        vm.showTaskDescBtn = function(event, task) {
            event.stopPropagation();
            event.preventDefault();
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element('body'))
                .clickOutsideToClose(true)
                .title('【' + task.taskName + '】')
                .htmlContent('<div>' + (task.taskDesc.trim() === '') ? '<grey>描述：</grey><em>null</em>' : '<grey>描述：</grey>' + task.taskDesc.replace(/\n/ig, '<br/>') + '</div>')
                .ariaLabel('任务描述')
                .ok('关闭')
                .targetEvent(event)
            );
        }
        vm.showUpdateRateDialog = function(event, task) {
            var parentEl = angular.element('body');
            TaskOperate.showRateDialog(event, task, parentEl, function() {
                tabReflash();
            });
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

    function OperateController(ModelCURD, $mdDialog, $window, $document, $timeout, toastr, $state, TaskOperate, allProjects) {
        var vm = this;
        vm.selected = [];
        vm.projects = allProjects;

        vm.gettaskList = function() {
            vm.tasksLoadEnd = false;
            TaskOperate.get({ projectId: vm.selectedProject._id }, function(docs) {
                vm.tasks = docs;
                vm.tasksLoadEnd = true
            });
        }

        vm.editTask = function(task) {
            $state.go("home.task.detail", { task: task, readOnly: false }, { inherit: false });
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
                    TaskOperate.get({ projectId: vm.selectedProject._id }, function(docs) {
                        vm.tasks = docs;
                    });
                })
            });
        }
        vm.showUpdateRateDialog = function(event, task) {
            var parentEl = angular.element('body');
            TaskOperate.showRateDialog(event, task, parentEl, function() {
                TaskOperate.get({ projectId: vm.selectedProject._id }, function(docs) { vm.tasks = docs });
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
                var parentEl =angular.element('body');
                $mdDialog.show({
                    parent: parentEl,
                    targetEvent: event,
                    template: '<md-dialog aria-label="UpdateProgress" >' +
                        '<div class="md-dialog-content">' +
                        '<span style="margin-top: 10px;text-align: center;color: #888;">进度：{{vm.done}}/{{vm.total}}</span>' +
                        '<md-dialog-content style="min-width:600px;min-height:100px;">' +
                        '<md-progress-linear style="margin:40px 0;padding:0 20px;" md-mode="determinate" value="{{vm.determinateValue}}"></md-progress-linear>' +
                        '</md-dialog-content>' +
                        '</div>' +
                        '</md-dialog>',
                    locals: {
                        obj: { works: finishWorkArray, desc: desc, parent: vm }
                    },
                    controller: UpdateProgressController,
                    controllerAs: 'vm'
                });

                function UpdateProgressController(obj) {
                    var parent = obj.parent;
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
                                $timeout(function() {
                                    $mdDialog.hide();
                                }, 300);
                                TaskOperate.get({ projectId: vm.selectedProject._id }, function(docs) {
                                    parent.tasks = docs;
                                });
                                toastr.success('【' + obj.works.length + '】个任务完成!');

                            }

                        });

                    });
                }

            });
        }
        //vm.gettaskList();
    }
    function HomeController(){

    }
    
    function JournalController($mdDialog, ModelCURD, $http, toastr, $window, $document, servicehost, apiVersion) {
        var vm = this;
        var journalCURD = ModelCURD.createCURDEntity('journal');
        vm.editJournal = function(event, journal) {
            $mdDialog.show({
                templateUrl: 'app/journal/journal.html',
                parent: angular.element('body'),
                targetEvent: event,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: { journal: journal },
                controllerAs: 'vm',
                controller: function(journal, $mdDialog, moment) {
                    var vm = this;
                    if (angular.isUndefined(journal)) {
                        journal = {
                            createAccount: $window.sessionStorage.account,
                            userName: $window.sessionStorage.name,
                            journalTime: new Date()
                        };
                    }
                    vm.journal = journal;
                    vm.journal.journalTime = moment(vm.journal.journalTime).toDate();
                    var preJournal = angular.copy(journal);
                    vm.cancel = function() {
                        journal.title = preJournal.title;
                        journal.log = preJournal.log;
                        journal.journalTime = preJournal.journalTime;
                        $mdDialog.cancel();
                    }
                    vm.submitJournal = function() {
                        journalCURD.update(vm.journal).$promise.then(function() {
                            if (!vm.journal._id) {
                                initJournalList();
                            }
                            $mdDialog.cancel();
                            toastr.success('日志【' + vm.journal.title + '】更新成功!');
                        });
                    }
                }
            });
        }
        vm.deleteJournal = function(ev, journal) {
            var confirm = $mdDialog.confirm()
                .title('是否删除【' + journal.title + '】?')
                .textContent(journal.log)
                .ariaLabel('Delete')
                .targetEvent(ev)
                .ok('确定')
                .cancel('取消');
            $mdDialog.show(confirm).then(function() {
                journalCURD.delete({ id: journal._id }).$promise.then(function() {
                    initJournalList();
                    toastr.success('日志【' + journal.title + '】删除成功!');
                });
            });
        }
        vm.InView = function(index) {
            vm.journals[index].active = true;
        }

        vm.journals = [];
        vm.loaded = false;

        function initJournalList() {
            vm.loadConfig.enableDataToload = true;
            vm.loadConfig.loadNumer = 0;
            vm.journals = [];
            vm.loaded = false;
            getJournalList();
        }
        vm.loadConfig = {
            loadNumer: 0,
            step: 20,
            enableDataToload: true
        }
        vm.loadjournalMore = function() {
            getJournalList();
        }
        vm.scrollTop = function() {
            $document.stop().animate({ scrollTop: 0 }, '500', 'swing', angular.noop);
        }

        function getJournalList() {
            var req = {
                url: servicehost + apiVersion + 'journal/list/' + vm.loadConfig.loadNumer,
                method: 'GET'
            }
            vm.loadConfig.enableDataToload = false;
            $http(req).success(function(docs) {
                vm.loaded = true;
                vm.journals = vm.journals.concat(docs);
                vm.loadConfig.loadNumer += docs.length;
                vm.loadConfig.enableDataToload = true;
                if (docs.length < vm.loadConfig.step) {
                    vm.loadConfig.enableDataToload = false;
                }
            });
        }


    }

})();
