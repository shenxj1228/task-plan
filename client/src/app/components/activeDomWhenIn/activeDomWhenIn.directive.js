(function() {
    'use strict';

    angular
        .module('projectTask')
        .directive('activedom', activedom);

    function activedom($window) {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, elem,atttr) {
                angular.element('.activedom').bind('scroll', function() {
                	console.log(1);
                    var offsetTop = elem.offset().top;
                    var h = elem.height();
                    if (offsetTop + h <= $(window).scrollTop() + $(window).height()) {
                        angular.element(elem).addClass('active');
                    }
                });

            }
        }
    }
})();
