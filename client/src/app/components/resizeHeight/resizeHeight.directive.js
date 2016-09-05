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
                    if($window.innerWidth>911){
                        elem.css({'min-height':$window.innerHeight,'height':$window.innerHeight});
                    }else{
                        elem.css({'min-height':'auto','height':'auto'});
                    }
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
