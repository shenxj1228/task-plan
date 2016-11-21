(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('ProjectController', ProjectController)
        .controller('ProjectTaskListController', ProjectTaskListController);

    function ProjectController($mdDialog,$http, $state, ToastDialog, ModelCURD, toastr,servicehost, apiVersion) {
        var vm = this;
        var projectCURD = ModelCURD.createCURDEntity('project');
        vm.newProject = new projectCURD();

        vm.projects = [];

        //初始化table
        function loadList() {
            vm.projects = projectCURD.query({});
        }
        loadList();
        vm.activeProject = function(event, project) {
            var req = {
                method: 'POST',
                url: servicehost + apiVersion + 'active-project/' + project._id
            };
            $http(req).success(function() {
                $state.reload();
            });
        }

        vm.deleteProject = function(event, p) {
            var confirm = $mdDialog.confirm()
                .title('是否删除项目【' + p.projectName + '】?')
                .ariaLabel('删除项目')
                .targetEvent(event)
                .ok('确定!')
                .cancel('取消');

            $mdDialog.show(confirm).then(function() {
                projectCURD.delete({ id: p._id }).$promise.then(function() {
                    toastr.success('项目【' + p.projectName + '】删除成功!');
                    $state.reload();
                }, function(httpResponse) {
                    //console.log(httpResponse.status);
                });
            });

        }
        vm.goToTaskListPage = function(id) {
            $state.go('home.project.tasklist', { projectId: id });
        }

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
                if (result.trim() != '') {
                    vm.newProject.projectName = result;
                    vm.newProject.rate = 0;
                    vm.newProject.$save(function() {
                        toastr.success('项目名称：' + vm.newProject.projectName + '!', '新增项目成功!');
                        $state.reload();
                    }, function() {
                        toastr.error('新增项目失败!');
                    });
                }
            }, function() {
                //cosole.log('取消新增');
            });
        }


    }



    function ProjectTaskListController($mdDialog, ModelCURD, $stateParams,$document) {
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

        
        vm.viewTaskDetail = function(event, task) {
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
                    task.planStartTime = moment(task.planStartTime, 'YYYY-MM-DD').toDate();
                    task.planEndTime = moment(task.planEndTime, 'YYYY-MM-DD').toDate();
                    vm.isReadonly = true;
                    vm.task = task;
                }
            });
        }

    }


})();
