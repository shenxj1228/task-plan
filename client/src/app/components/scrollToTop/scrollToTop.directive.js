(function() {
    'use strict';

    angular
        .module('projectTask')
        .directive('scrolltotop', scrolltotop);

    function scrolltotop() {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, ele, attr) {
                ele.on('click', function() {
                    angular.element(attr.scrolltotop).animate({ scrollTop: 0}, "slow");
                });

            }
        }
    }
})();
