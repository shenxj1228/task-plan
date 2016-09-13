(function() {

    angular
        .module('projectTask')
        .controller('TaskController', TaskController);

    function TaskController($http, ToastDialog, Modelcurl, servicehost, $timeout, toastr, $q) {
        
        var tk = this;
        var taskCurl = Modelcurl.createCurlEntity('task');
        tk.newTask = new taskCurl();
        tk.selected = [];
        tk.query = {
            order: "taskName",
            limit: 5,
            page: 1
        };
        tk.searchtitle = '';
        tk.usefulProjects=[];
        tk.add = function(ev) {

        };
        //初始化table
        function tableInit(searchtitle, skip, limit) {
            skip = skip || (tk.query.page - 1) * tk.query.limit;
            limit = limit || tk.query.limit;
            var searchObj;
            if (!searchtitle || searchtitle === '') {
                searchObj = {};
            } else {
                searchObj = { "title": { $regex: new RegExp(searchtitle) } };
            }
            var deferred = $q.defer();
            tk.promise = deferred.promise;

            deferred.resolve();

        }
        tk.getUsefulProjects = function() {
            var projectCurl = Modelcurl.createCurlEntity('project');
            tk.usefulProjects= projectCurl.query({rate:{$ne:100}});
        }


        tableInit();
    }
})();
