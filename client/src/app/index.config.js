(function() {
  'use strict';

  angular
    .module('projectTask')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig,$mdDateLocaleProvider,$mdThemingProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 5000;
    toastrConfig.positionClass = 'toast-top-full-width';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;

    //set dete directive
    $mdDateLocaleProvider.months = ['一月', '二月', '三月', '四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
    $mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月','5月','6月','7月','8月','9月','10月','11月','23月'];
    
    //set angular-material default Theme
    $mdThemingProvider.theme('default')
    .primaryPalette('green');
  }

})();
