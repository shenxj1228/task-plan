(function() {

    angular
        .module('projectTask')
        .controller('TaskManageController', TaskManageController)
        .controller('TaskAddController', TaskAddController);

    function TaskManageController($log, ToastDialog, ModelCURD, $window, servicehost, $timeout, toastr, $mdDialog, $q, $scope) {
        var vm = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        vm.selected = [];
        vm.query = {
            order: "taskName",
            limit: 5,
            page: 1
        };


        vm.tasks = [];
        vm.all = 0;
        vm.searchText = '';
        vm.getTasks = function() {
            tableInit();
        }
        vm.formatDate = function(isoDate) {
            return $window.moment(isoDate).format('YYYY-MM-DD');
        }
        vm.delTasks = function(ev) {
                var delWarnInfo = '任务【 ' + vm.selected[0].taskName + ' 】将被删除!';
                if (vm.selected.length > 1) {
                    delWarnInfo = '【 ' + vm.selected.length + ' 】项任务将被删除!'
                }
                var confirm = $mdDialog.confirm()
                    .title('确定要删除吗?')
                    .textContent(delWarnInfo)
                    .ariaLabel('Delete')
                    .targetEvent(ev)
                    .ok('确定')
                    .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    var _idArray = '';
                    vm.selected.forEach(function(element, index) {
                        _idArray += element._id + (vm.selected.length === (index + 1) ? '' : ',');
                    });
                    taskCURD.delete({ _id__in: _idArray });
                    vm.selected = [];
                    tableInit();
                }, function() {});
            }
            //初始化table
        function tableInit(skip, limit) {

            skip = skip || (vm.query.page - 1) * vm.query.limit;
            limit = limit || vm.query.limit;
            var searchObj;

            if (!vm.searchText || vm.searchText.trim() === '') {
                searchObj = { __limit: limit, __offset: skip, __sort: 'taskName' };
            } else {
                searchObj = { taskName__re: vm.searchText.split('').join('.*?'), __limit: limit, __offset: skip, __sort: 'taskName' };
            }
            if (parseInt($window.sessionStorage.userRole) > 10) {
                searchObj.dealAccount = $window.sessionStorage.account;
            }
            var deferred = $q.defer();
            vm.promise = deferred.promise;
            taskCURD.queryPerPage(searchObj).$promise.then(function(data) {
                vm.tasks = data.docs;
                vm.all = data.count;
                deferred.resolve();
            });

        }
        var searchtimer;
        $scope.$watch('vm.searchText', function(newvalue, oldvalue) {
            $timeout.cancel(searchtimer);
            if (newvalue != oldvalue) {
                searchtimer = $timeout(function() {
                    vm.getTasks(0, vm.query.limit);
                }, 300);
            }
        });

        vm.getTasks();
    }

    function TaskAddController($log, ToastDialog,usefulProjects,usefulUsers,task, ModelCURD,  toastr
, $stateParams, $window) {
        var vm = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        vm.usefulProjects = usefulProjects;
        vm.usefulUsers = usefulUsers;
        vm.newTask=task;
        vm.addTask = function() {
            var loadingInstance = ToastDialog.showLoadingDialog();
            vm.newTask.userName = vm.newTask.user.name;
            vm.newTask.dealAccount = vm.newTask.user.account;
            delete vm.newTask.user;
            vm.newTask.projectId = vm.newTask.project._id;
            vm.newTask.projectName = vm.newTask.project.projectName;
            delete vm.newTask.project;
            if ($stateParams._id != '') {
                $log.debug('update');
            } else {
                vm.newTask.$save(function(res) {
                    loadingInstance.close();
                    if (res.error != null) {
                        toastr.error(res.message, '新增任务失败');
                        return;
                    }
                    toastr.success('新增任务【 ' + vm.newTask.taskName + ' 】', '新增任务成功!');
                    initNewTask();
                }, function(err) {
                    $log.debug(err);
                    loadingInstance.close();
                    toastr.error('新增任务失败,请重试', '发生异常');
                });
            }
        }

        function initNewTask() {
            vm.newTask = new taskCURD();
            vm.newTask.dealAccount = $window.sessionStorage.account;
            vm.newTask.planStartTime = $window.moment(new Date(), 'YYYY-MM-DD').toDate();
            vm.newTask.planEndTime = $window.moment(new Date(), 'YYYY-MM-DD').toDate();
        }
    }
})();
