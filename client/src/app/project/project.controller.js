(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('ProjectController', ProjectController);

    function ProjectController($http, $mdDialog, $state, ToastDialog, ModelCURD, servicehost, $timeout, toastr) {
        var vm = this;
        var projectCURD = ModelCURD.createCURDEntity('project');
        vm.newProject = new projectCURD();
        vm.projects = [];

        //初始化table
        function loadList() {
           vm.projects = projectCURD.query();

        }
        loadList();
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

})();
