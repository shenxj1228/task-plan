(function() {
    'use strict';

    angular
        .module('projectTask')
        .directive('resizable', resizable);

    function resizable($window) {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, elem) {
                function initializeWindowSize() {
                    elem.css('min-height', $window.innerHeight);
                }
                initializeWindowSize();
                angular.element($window).bind('resize', function() {
                    initializeWindowSize();
                    scope.$apply();
                });
            }
        }
    }
})();
