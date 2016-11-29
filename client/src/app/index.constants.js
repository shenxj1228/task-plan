/* global malarkey:false, moment:false */
(function() {
    'use strict';

    angular
        .module('projectTask')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('servicehost', 'http://192.168.191.220:8122')
        .constant('apiVersion','/api/v1/');
})();
