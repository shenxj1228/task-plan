(function() {

    angular
        .module('projectTask')
        .controller('TaskManageController', TaskManageController)
        .controller('TaskAddController', TaskAddController);

    function TaskManageController($log, ToastDialog, ModelCURD, servicehost, $timeout, toastr, $mdDialog, $q, $scope) {
        var tkManage = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        tkManage.selected = [];
        tkManage.query = {
            order: "taskName",
            limit: 5,
            page: 1
        };
        tkManage.tasks = [];
        tkManage.all = 0;
        tkManage.searchText = '';
        tkManage.getTasks = function() {
            tableInit();
        }
        tkManage.formatDate = function(isoDate) {
            return moment(isoDate).format('YYYY-MM-DD');
        }
        tkManage.delTasks = function(ev) {
                var delWarnInfo = '任务【 ' + tkManage.selected[0].taskName + ' 】将被删除!';
                if (tkManage.selected.length > 1) {
                    delWarnInfo = '【 ' + tkManage.selected.length + ' 】项任务将被删除!'
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
                    tkManage.selected.forEach(function(element, index) {
                        _idArray += element._id + (tkManage.selected.length === (index + 1) ? '' : ',');
                    });
                    taskCURD.delete({ _id__in: _idArray });
                    tkManage.selected = [];
                    tableInit();
                }, function() {});
            }
            //初始化table
        function tableInit(skip, limit) {

            skip = skip || (tkManage.query.page - 1) * tkManage.query.limit;
            limit = limit || tkManage.query.limit;
            var searchObj;

            if (!tkManage.searchText || tkManage.searchText.trim() === '') {
                searchObj = { __limit: limit, __offset: skip, __sort: 'taskName' };
            } else {
                searchObj = { taskName__re: tkManage.searchText.split('').join('.*?'), __limit: limit, __offset: skip, __sort: 'taskName' };
            }
            var deferred = $q.defer();
            tkManage.promise = deferred.promise;
            taskCURD.queryPerPage(searchObj).$promise.then(function(data) {
                tkManage.tasks = data.docs;
                tkManage.all = data.count;
                deferred.resolve();
            });

        }
        var searchtimer;
        $scope.$watch('tkManage.searchText', function(newvalue, oldvalue) {
            $timeout.cancel(searchtimer);
            if (newvalue != oldvalue) {
                searchtimer = $timeout(function() {
                    tkManage.getTasks(0, tkManage.query.limit);
                }, 300);
            }
        });

        tkManage.getTasks();
    }

    function TaskAddController($log, ToastDialog, ModelCURD, servicehost, $timeout, toastr, $stateParams) {
        var tkAdd = this;
        var isUpdate = false;
        var taskCURD = ModelCURD.createCURDEntity('task');
        var projectCURD = ModelCURD.createCURDEntity('project');
        var userCURD = ModelCURD.createCURDEntity('user');
        if ($stateParams._id != '') {
            isUpdate = true;
            tkAdd.newTask = taskCURD.queryById({ id: $stateParams._id }).$promise.then(function(doc) {
                tkAdd.newTask = doc;
                tkAdd.newTask.planStartTime = moment(tkAdd.newTask.planStartTime).format('YYYY-MM-DD');
                tkAdd.newTask.planEndTime = moment(tkAdd.newTask.planEndTime).format('YYYY-MM-DD');
            });
        } else {
            tkAdd.newTask = new taskCURD();
        }

        tkAdd.usefulProjects = [];
        tkAdd.usefulUsers = [];
        tkAdd.getUsefulProjects = function() {
            tkAdd.usefulProjects = projectCURD.query({ rate__ne: 100 });
        }
        tkAdd.getusefulUser = function() {
            tkAdd.usefulUsers = userCURD.query({ status: true, role__gt: 1 });
        }
        tkAdd.addTask = function() {
            var loadingInstance = ToastDialog.showLoadingDialog();
            tkAdd.newTask.userName = tkAdd.newTask.user.name;
            tkAdd.newTask.dealAccount = tkAdd.newTask.user.account;
            delete tkAdd.newTask.user;
            tkAdd.newTask.projectId = tkAdd.newTask.project._id;
            tkAdd.newTask.projectName = tkAdd.newTask.project.projectName;
            delete tkAdd.newTask.project;
            if (!isUpdate) {
                tkAdd.newTask.$save(function(res, headers) {
                    loadingInstance.close();
                    if (res.error != null) {
                        toastr.error(res.message, '新增任务失败');
                        return;
                    }
                    toastr.success('新增任务--' + tkAdd.newTask.taskName + '!', '新增任务成功!');
                    tkAdd.newTask = new taskCURD();
                }, function(err) {
                    $log.debug(err);
                    loadingInstance.close();
                    toastr.error('新增任务失败,请重试', '发生异常');
                });
            } else {
                
            }
        }
    }
})();
