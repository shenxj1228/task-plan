/* global malarkey:false, moment:false */
(function() {
    'use strict';

    angular
        .module('projectTask')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('servicehost', 'http://localhost:8122');
})();
