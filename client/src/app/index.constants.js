/* global malarkey:false, moment:false */
(function() {
    'use strict';

    angular
        .module('projectTask')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('servicehost', 'http://127.0.0.1:8122')
        .constant('apiVersion','/api/v1/');
})();
