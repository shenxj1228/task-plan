(function() {
    'use strict';

    angular
        .module('projectTask')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, $mdDateLocaleProvider, $mdThemingProvider, moment, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 2000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = false;
        toastrConfig.progressBar = false;

        //set dete directive
        $mdDateLocaleProvider.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        $mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '23月'];
        $mdDateLocaleProvider.formatDate = function(date) {
            var m =moment(date);
            return m.isValid() ? m.format('YYYY-MM-DD') : '';
        };
        //set angular-material default Theme
        $mdThemingProvider.theme('default')
            .primaryPalette('green');

        //set http interceptors
        $httpProvider.interceptors.push('TokenInterceptor');

    }


})();
