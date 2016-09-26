(function() {
	 'use strict';
    angular
        .module('projectTask')
        .directive('chartsLegend', chartsLegend);

    function chartsLegend() { /*needs $scope.show to be defined...*/
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/chartsLegend/charts-legend.html',
            scope: {
                chartdata: "=",
                show: "="
            }
        };
    }

})();
