(function() {

    angular
        .module('projectTask')
        .controller('TaskController', TaskController);

    function TaskController($http,$log, ToastDialog, ModelCURD, servicehost, $timeout, toastr, $q) {
        var tk = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        var projectCURD = ModelCURD.createCURDEntity('project');
        var userCURD = ModelCURD.createCURDEntity('user');
        tk.newTask = new taskCURD();
        tk.selected = [];
        tk.query = {
            order: "taskName",
            limit: 5,
            page: 1
        };
        tk.searchtitle = '';
        tk.usefulProjects = [];
        tk.usefulUsers = [];
        //初始化table
        function listInit(searchtitle, skip, limit) {

            skip = skip || (tk.query.page - 1) * tk.query.limit;
            limit = limit || tk.query.limit;
            var searchObj;
            if (!searchtitle || searchtitle === '') {
                searchObj = {};
            } else {
                searchObj = { "taskName": { $regex: new RegExp(searchtitle) } };
            }
            var deferred = $q.defer();
            tk.promise = deferred.promise;
           taskCURD.queryPerPage({__limit:limit,__offset:skip,__sort:'taskName'}).$promise.then(function(data){
             tk.tasks=data.docs;
             tk.all=data.count;
           })
            
            deferred.resolve();

        }
        tk.getUsefulProjects = function() {
            tk.usefulProjects = projectCURD.query({ rate__ne: 100 });
        }
        tk.getusefulUser = function() {
            tk.usefulUsers = userCURD.query({ status: true, role__gt: 1 });
        }
        tk.addTask = function() {
            var loadingInstance = ToastDialog.showLoadingDialog();
            tk.newTask.userName=$.grep(tk.usefulUsers,function(user){
                return user.account===tk.newTask.dealAccount;
            })[0].name;
            tk.newTask.$save(function(res, headers) {
                loadingInstance.close();
                if (res.error != null) {
                    toastr.error(res.message, '新增任务失败');
                    return;
                }
                toastr.success('新增任务--' + tk.newTask.taskName + '!', '新增任务成功!');
                tk.newTask = new taskCURD();
            }, function(err) {
                $log.debug(err);
                loadingInstance.close();
                toastr.error('新增任务失败,请重试', '发生异常');
            });
        }

        listInit();
    }
})();
