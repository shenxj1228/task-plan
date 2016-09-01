(function() {
    'use strict';

    angular
        .module('projectTask')
        .factory('Modelcurl', Modelcurl)
        .factory('ToastDialog', ToastDialog);

    function Modelcurl($resource, servicehost) {
        var models = ['user', 'porject', 'task', 'journal'],
            modelsObj = new Object;
        models.forEach(function(element) {
            modelsObj[element.firstUpperCase()] = $resource(servicehost + '/api/' + element + '/:id', { id: '@_id' });
        });
        return modelsObj;
    }


    function ToastDialog($uibModal) {
        var baseDialog = {
            animation: true,
            template: '',
            size: 'sm',
            windowTopClass: 'fixed-center dialog-lg',
            backdrop: 'static'
        }
        var loadingDialog={},
            successDialog ={},
            errorDialog={};
            angular.copy(baseDialog,loadingDialog);
            angular.copy(baseDialog,successDialog);
            angular.copy(baseDialog,errorDialog);

        loadingDialog.template = '<div class="loading-dialog dialog"><span class="content">加载中</span></div>';
        successDialog.template = '<div class="success-dialog dialog"><div class="content"><i class="material-icons">done</i><span>成功</span></div></div>';
        successDialog.backdrop='true';
        errorDialog.template = '<div class="error-dialog dialog"><div class="content"><i class="material-icons">highlight_off</i><span>失败</span></div></div>';
        errorDialog.backdrop='true';
        return {
            showLoadingDialog: function() {
                return $uibModal.open(loadingDialog);
            },
            showSuccessDialog: function() {
                return $uibModal.open(successDialog);
            },
            showErrorDialog: function() {
                return $uibModal.open(errorDialog);
            }
        }
    }
    String.prototype.firstUpperCase = function() {
        return this.toString()[0].toUpperCase() + this.toString().slice(1);
    }

})();
