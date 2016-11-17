(function() {
    'use strict';
    angular
        .module('projectTask')
        .controller('InfoController', InfoController);

    function InfoController(UserAuthFactory, ModelCURD, $window, moment, $http, $document, $log, $mdDialog, $mdBottomSheet, servicehost, apiVersion,$rootScope) {
        var vm = this;
        vm.signOut = function() {
                UserAuthFactory.signOut();
            }
            //打开修改密码Dialog
        vm.changepwd = function(ev) {
            $mdDialog.show({
                templateUrl: 'app/user/changepwd.html',
                parent: $document.body,
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {
                    user: {
                        account: $window.sessionStorage.account,
                        id: $window.sessionStorage.Uid
                    }
                },
                controller: chgpwdDialogController,
                controllerAs: 'vm'
            });
        }
        vm.showAvatarDaialog = function(ev) {
                $mdDialog.show({
                    templateUrl: 'app/user/avatar.html',
                    parent: $document.body,
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controllerAs: 'vm',
                    controller: function($scope) {
                        var vm = this;
                        vm.myImage = '';
                        vm.myCroppedImage = '';
                        vm.dialogClose=function(){
                            $mdDialog.cancel();
                        }
                        vm.saveAvatar = function() {
                            var req = {
                                method: 'POST',
                                url: servicehost + '/user/' + $window.sessionStorage.Uid + '/avatar',
                                contentType: "application/x-www-form-urlencoded",
                                data: { avatar: vm.myCroppedImage }
                            };

                            $http(req).then(function(data) {
                                $mdDialog.cancel();
                                $rootScope.avatarImg=servicehost+'/user/'+$window.sessionStorage.Uid+'/avatar'+ '?' + new Date().getTime();

                            }, function(err) {
                                console.log(err);
                            });
                        };
                        $scope.fileNameChanged = function(evt) {
                            var file = evt.files[0];
                            var reader = new FileReader();
                            reader.onload = function(evt) {
                                $scope.$apply(function() {
                                    vm.myImage = evt.target.result;
                                });
                            };
                            reader.readAsDataURL(file);
                        };
                    }
                });

            }
            //打开设置bottom sheet
        vm.showSettingSheet = function() {
            $mdBottomSheet.show({
                parent: $document.find('#userInfo'),
                templateUrl: 'app/info/bottom-sheet-grid.html',
                controller: GridBottomSheetCtrl,
                controllerAs: 'vm',
                clickOutsideToClose: true
            }).then(function(clickedItem) {
                switch (clickedItem['action']) {
                    case 'changeImage':
                        vm.showAvatarDaialog();
                        break;
                    case 'changePassword':
                        vm.changepwd();
                        break;
                    case 'signOut':
                        vm.signOut();
                        break;
                    default:
                        $log.error('无效的按钮');
                }
            });
        }


        vm.currentYearDoneTaskOptions = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function(d) {
                    return d.month + '月';
                },
                y: function(d) {
                    return d.count;
                },
                showValues: true,
                valueFormat: function(d) {
                    return $window.d3.format(',.0f')(d);
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: moment().year() + '年'
                },
                yAxis: {
                    axisLabel: '单子(个)',
                    axisLabelDistance: -10
                }

            },
            title: {
                enable: true,
                text: "每月完成任务单",
                className: "h4",
                css: {
                    width: "nullpx",
                    textAlign: "center"
                }
            }
        };
        vm.currentMonthDoneTaskOptions = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d) {
                    return d.day;
                },
                y: function(d) {
                    return d.count;
                },
                xAxis: {
                    axisLabel: moment().month() + '月'
                },
                yAxis: {
                    axisLabel: '单子(个)',
                    axisLabelDistance: -10
                }
            },
            title: {
                enable: true,
                text: '当月每日完成任务单',
                className: "h4",
                css: {
                    width: "nullpx",
                    textAlign: "center"
                }
            }
        };
        var startDate = moment().format('YYYY-01-01 00:00:00');
        var endDate = moment().add(1, 'year').format('YYYY-01-01 00:00:00');
        var req = {
            method: 'GET',
            url: servicehost + apiVersion + 'task-group-month',
            params: { realEndTime__exists: true, realEndTime__gte: startDate, realEndTime__lt: endDate }
        };
        $http(req).success(function(res) {
            //console.dir(res);
        });
        var req1 = {
            method: 'GET',
            url: servicehost + apiVersion + 'task-group-day',
            params: { realEndTime__exists: true, realEndTime__gte: moment().format('YYYY-MM-01 00:00:00'), realEndTime__lt: moment().add(1, 'months').format('YYYY-MM-01 00:00:00') }
        };
        $http(req1).success(function(res) {
            //console.dir(res);
        })

        //taskCURD.query({ account: $window.sessionStorage.account, realEndTime__gte: start.format('YYYY-MM-DD 00:00:00'), realEndTime__lt: end.format('YYYY-MM-DD 00:00:00') }).$promise.then(function(data) {
        //    console.dir(data);
        //});
        vm.currentYearDoneTaskData = [{
            key: "Cumulative Return",
            values: [
                { "month": "1", "count": 20.0 },
                { "month": "2", "count": 10.0 },
                { "month": "3", "count": 32.0 },
                { "month": "4", "count": 15.0 },
                { "month": "5", "count": 8.0 },
                { "month": "6", "count": 9.0 },
                { "month": "7", "count": 13.0 },
                { "month": "8", "count": 15.0 },
                { "month": "9", "count": 16.0 },
                { "month": "10", "count": 23.0 },
                { "month": "11", "count": 22.0 },
                { "month": "12", "count": 26.0 }
            ]
        }];
        vm.currentMonthDoneTaskData = [{
            key: '',
            values: [
                { 'day': 1, 'count': 10 },
                { 'day': 2, 'count': 4 },
                { 'day': 3, 'count': 3 },
                { 'day': 4, 'count': 6 },
                { 'day': 5, 'count': 7 },
                { 'day': 6, 'count': 2 },
                { 'day': 7, 'count': 3 },
                { 'day': 8, 'count': 3 },
                { 'day': 9, 'count': 4 },
                { 'day': 10, 'count': 3 },
                { 'day': 11, 'count': 6 },
                { 'day': 12, 'count': 2 },
                { 'day': 13, 'count': 1 },
                { 'day': 14, 'count': 8 },
                { 'day': 15, 'count': 2 }
            ]
        }];


        //BottomSheetController
        function GridBottomSheetCtrl() {
            var vm = this;
            vm.items = [
                { action: 'changeImage', name: '更改头像', icon: 'photo_camera' },
                { action: 'changePassword', name: '更改密码', icon: 'vpn_key' },
                { action: 'signOut', name: '正常退出', icon: 'power_settings_new' }
            ];

            vm.listItemClick = function($index) {
                var clickedItem = vm.items[$index];
                $mdBottomSheet.hide(clickedItem);
            };
        }

        //修改密码controller
        function chgpwdDialogController($mdDialog, ModelCURD, user, UserAuthFactory, toastr, $log) {
            var vm = this;
            vm.submitFormChgPwd = function() {
                UserAuthFactory.checkPwd(user.account, vm.inputOldPwd).success(function() {
                    var userCURD = ModelCURD.createCURDEntity('user');
                    userCURD.update({ id: user.id }, { newpwd: vm.inputNewPwd }, function() {
                        toastr.success('密码修改成功');
                        $mdDialog.hide();
                    }, function(err) {
                        $log.log(err);
                        toastr.error('密码重置失败', '发生异常');
                    })
                }).error(function() {
                    toastr.error('旧密码验证失败');
                });
            }
        }


    }
})();
