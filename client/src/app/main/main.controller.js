(function() {
    'use strict';
    angular.module('projectTask')
        //随窗口缩放
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController() {
        var vm = this;
        //定义标签页
        vm.menuList = [{
            state: 'home.warn',
            name: '提醒'
        }, {
            state: 'home.schedule',
            name: '进度'
        },{
            state: 'home.operate',
            name: '操作'
        }, {
            state: 'home.project.list',
            name: '项目管理'
        },{
            state: 'home.task.list',
            name: '任务管理'
        },{
            state: 'home.user.list',
            name: '用户管理'
        }, {
            state: 'home.info',
            name: '个人信息'
        }];
       

    }
})();
