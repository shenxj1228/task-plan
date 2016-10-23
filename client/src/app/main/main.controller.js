(function() {
    'use strict';
    angular.module('projectTask')
        //随窗口缩放
        .controller('MainController', MainController)
        .controller('WorkController', WorkController);

    /** @ngInject */
    function MainController($window, $rootScope, UserAuthFactory, ModelCURD) {
        var vm = this;
        $rootScope.selfUser = {
            name: $window.sessionStorage.name,
            account: $window.sessionStorage.account,
            role: $window.sessionStorage.userRole,
            createTime: $window.sessionStorage.createTime
        };
        //定义标签页
        vm.menuList = [{
            state: 'home.work',
            name: '工作内容'
        }, {
            state: 'home.schedule',
            name: '进度'
        }, {
            state: 'home.operate',
            name: '操作'
        }, {
            state: 'home.task',
            name: '任务管理'
        }, {
            state: 'home.info',
            name: '个人信息'
        }];
        //给管理者增加菜单
        if ($rootScope.selfUser.role < 10) {
            vm.menuList = [{
                state: 'home.project',
                name: '项目管理'
            }, {
                state: 'home.user',
                name: '用户管理'
            }];
        }

        vm.signOut = function() {
            UserAuthFactory.signOut();
        }
        var taskCURD = ModelCURD.createCURDEntity('task');
        taskCURD.count({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime__lte: ($window.moment().format('YYYY-MM-DD') + ' 00:00:00') })
            .$promise.then(function(data) {
                if (data.count === 0) {
                    vm.worksCount = '';
                } else if (data.count > 9) {
                    vm.worksCount = '9+';
                } else {
                    vm.worksCount = data.count;
                }

            });

    }


    function WorkController($window, $rootScope, ModelCURD, $mdDialog,fDate) {
        var vm = this;
        var taskCURD = ModelCURD.createCURDEntity('task');
        taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime__lte: ($window.moment().subtract(1, 'd').format('YYYY-MM-DD') + ' 00:00:00') })
            .$promise.then(function(data) {
                vm.ExWorkLoadingEnd = true
                vm.extendedWorks = data;
            });
        taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime: ($window.moment().format('YYYY-MM-DD') + ' 00:00:00') })
            .$promise.then(function(data) {
                vm.TDLoadingEnd = true;
                vm.todayWorks = data;
            });
        taskCURD.query({ dealAccount: $window.sessionStorage.account, rate__lt: 100, planEndTime: ($window.moment().add(1, 'd').format('YYYY-MM-DD') + ' 00:00:00') })
            .$promise.then(function(data) {
                vm.TWLoadingEnd = true;
                vm.tomorrowWorks = data;
            });

        vm.finishTaskBtn = function(event,work) {
            console.dir(fDate.getNowDate());
            console.dir(fDate.getDate('2015-12-1'));
            console.dir(fDate.getFirstDayByYear());
            console.dir(fDate.getFirstDayByNextYear());
            console.dir(fDate.getFirstDayByMonth());
            console.dir(fDate.getFirstDayByNextMonth());
            event.stopPropagation();
            event.preventDefault();
            var confirm = $mdDialog.confirm()
                .title('是否将完成当前任务【'+work.taskName+'】?')
                .targetEvent(event)
                .ok('是')
                .cancel('否');

            $mdDialog.show(confirm).then(function() {
                taskCURD.update({id:work._id},{rate:100,real_end})
            }, function() {
                alert(2)
            });


        }

        function finishTask(work){
            if(!work.realStartTime||work.realStartTime===''){
                //work.realStartTime=fDate
            }
        }
    }


})();
