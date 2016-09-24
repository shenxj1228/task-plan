(function() {
    'use strict';
    angular
        .module('projectTask')
        .directive('datepickerValidationFix', datepickerValidationFix);

    function datepickerValidationFix() {
        return {
            restrict: 'A',
            require: 'mdDatepicker',
            link: function(scope, element, attrs, mdDatepickerCtrl) {
 
                mdDatepickerCtrl.$scope.$watch(function() {
                    return mdDatepickerCtrl.minDate; }, function() {
                    if (mdDatepickerCtrl.dateUtil.isValidDate(mdDatepickerCtrl.date)) {
                        mdDatepickerCtrl.updateErrorState.call(mdDatepickerCtrl);
                    }
                });
                mdDatepickerCtrl.$scope.$watch(function() {
                    return mdDatepickerCtrl.date; }, function(newVal, oldVal) {
                    mdDatepickerCtrl.updateErrorState.call(mdDatepickerCtrl);
                });
            }
        };
    }
})();
