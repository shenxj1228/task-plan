(function() {
    'use strict';

    angular
        .module('projectTask')
        .directive('uploadfile', uploadfile);

    function uploadfile($parse) {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, ele, attr) {
                ele.css({ position: 'relative', overflow: 'hidden', margin: '10px' });
                ele.append('<input type = "file" accept="image/*" style = "position: absolute;top: 0; right: 0;margin: 0;padding: 0;font-size: 20px;cursor: pointer;opacity: 0;filter: alpha(opacity=0);" " / > ');
                ele.children('input').on('change', function(evt) {
                    var func = $parse(attr.uploadfile)(scope);
                    func(evt.currentTarget.files);
                });
            }
        }
    }
})();
