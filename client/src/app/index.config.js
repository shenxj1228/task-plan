(function() {
    'use strict';

    angular
        .module('projectTask')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, $mdDateLocaleProvider, $mdThemingProvider, $windowProvider, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 2000;
        toastrConfig.positionClass = 'toast-top-full-width';
        toastrConfig.preventDuplicates = false;
        toastrConfig.progressBar = true;

        //set dete directive
        $mdDateLocaleProvider.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        $mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '23月'];
        $mdDateLocaleProvider.formatDate = function(date) {
            var m = $windowProvider.$get().moment(date);
            return m.isValid() ? m.format('YYYY-MM-DD') : '';
        };
        //set angular-material default Theme
        $mdThemingProvider.theme('default')
            .primaryPalette('green');

        //set http interceptors
        $httpProvider.interceptors.push('TokenInterceptor');
        $httpProvider.interceptors.push(function($q, $injector) {
            return {
                request: function(config) {
                    config.timeout = 5000;
                    return config;
                },
                responseError: function(rejection) {
                    console.dir(rejection);
                    switch (rejection.status) {
                        case 408:
                            console.log('连接超时');
                            break;
                        case -1:
                            
                            console.log('无法连接');
                            break;
                    }
                    return $q.reject(rejection);
                }
            }
        });

    }


})();
