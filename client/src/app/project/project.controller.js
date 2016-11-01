(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('ProjectController', ProjectController)
        .controller('ProjectListController', ProjectListController)
        .controller('ProjectTaskListController', ProjectTaskListController);

    function ProjectController($mdDialog, $state, ToastDialog, ModelCURD, toastr) {
        var vm = this;
        var projectCURD = ModelCURD.createCURDEntity('project');
        vm.newProject = new projectCURD();

        vm.showAddDialog = function(ev) {
            var confirm = $mdDialog.prompt()
                .title('新增一个项目')
                .placeholder('项目名称')
                .ariaLabel('项目名称')
                .initialValue('')
                .targetEvent(ev)
                .ok('确定')
                .cancel('取消');
            $mdDialog.show(confirm).then(function(result) {
                var loadingInstance = ToastDialog.showLoadingDialog();
                vm.newProject.projectName = result;
                vm.newProject.rate = 0;
                vm.newProject.$save(function() {
                    loadingInstance.close();
                    toastr.success('项目名称：' + vm.newProject.projectName + '!', '新增项目成功!');
                    $state.reload();
                }, function() {
                    loadingInstance.close();
                    toastr.error('新增项目失败!');
                });
            }, function() {
                //cosole.log('取消新增');
            });
        }


    }

    function ProjectListController($http, $state, ModelCURD, servicehost, apiVersion) {
        var vm = this;
        var projectCURD = ModelCURD.createCURDEntity('project');
        vm.projects = [];

        //初始化table
        function loadList() {
            vm.projects = projectCURD.query();
        }
        loadList();
        vm.activeProject = function(event, project) {
            var req = {
                method: 'POST',
                url: servicehost + apiVersion + 'active-project/' + project._id
            };
            $http(req).success(function(res) {
                $state.reload();
            });
        }
        vm.goToTaskListPage = function(id) {
            $state.go('home.project.manage.tasklist', { projectId: id });
        }
    }

    function ProjectTaskListController($mdDialog, ModelCURD, $stateParams) {
        var vm = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        vm.tasks = [];
        function loadList() {
            taskCURD.query({ projectId: $stateParams.projectId }).$promise.then(function(docs) {
                vm.tasks = docs;
                vm.hideLoading = true;
            });
        }
        loadList();

        function TaskDetailController(task) {
            vm.newTask = task;
        }
        vm.viewTaskDetail = function(event, task) {
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

    }


})();
