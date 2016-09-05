(function() {

    angular
        .module('projectTask')
        .controller('ProjectController', ProjectController);

    function ProjectController($http, ToastDialog, Modelcurl, servicehost, $timeout, toastr,$q) {
        var pj = this;
       pj.selected = [];
        pj.query = {
            order: "taskName",
            limit: 5,
            page: 1
        };
        pj.searchtitle = '';

        pj.add = function(ev) {
            
        }; 
        //初始化table
        function tableInit(searchtitle, skip, limit) {
            skip = skip || (pj.query.page - 1) * pj.query.limit;
            limit = limit || pj.query.limit;
            var searchObj;
            if (!searchtitle || searchtitle === '') {
                searchObj = {};
            } else {
                searchObj = { "title": { $regex: new RegExp(searchtitle) } };
            }
            var deferred = $q.defer();
            pj.promise = deferred.promise;
            
                deferred.resolve();
         
        }


       
        tableInit();
    }
})();
