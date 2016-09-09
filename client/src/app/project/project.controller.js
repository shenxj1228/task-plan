(function() {

    angular
        .module('projectTask')
        .controller('ProjectController', ProjectController);

    function ProjectController($http, $mdDialog, $state, ToastDialog, Modelcurl, servicehost, $timeout, toastr) {
        var pj = this;
        pj.newProject = new Modelcurl.Project();
        pj.projects = [];

        //初始化table
        function loadList() {
           pj.projects = Modelcurl.Project.query();

        }
        loadList();
        pj.showAddDialog = function(ev) {
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
                pj.newProject.projectName = result;
                pj.newProject.rate = 0;
                pj.newProject.$save(function(project) {
                    loadingInstance.close();
                    toastr.success('项目名称：' + pj.newProject.projectName + '!', '新增项目成功!');
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
