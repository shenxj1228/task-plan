(function() {

    angular
        .module('projectTask')
        .controller('TaskController', TaskController);

    function TaskController($http, ToastDialog, Modelcurl, servicehost, $timeout, toastr,$q) {
        var tk = this;
       tk.selected = [];
        tk.query = {
            order: "taskName",
            limit: 5,
            page: 1
        };
        tk.searchtitle = '';

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


       
        tableInit();
    }
})();
