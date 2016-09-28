(function() {
    'use strict';
    angular.module('projectTask')
        .controller('InfoController', InfoController);

    function InfoController(UserAuthFactory, ModelCURD, $window, $document, $log, $mdDialog,$mdBottomSheet) {
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
                    openFrom: angular.element(document.querySelector('#btnChgPwd')),
                    closeTo: angular.element(document.querySelector('body')),
                    clickOutsideToClose: true,
                    fullscreen: false,
                    locals: {
                        user: {
                            account: $window.sessionStorage.account,
                            id: $window.sessionStorage.user
                        }
                    },
                    controller: chgpwdDialogController
                });
            }
            //打开设置bottom sheet
        vm.showSettingSheet = function() {
            $mdBottomSheet.show({
                parent:angular.element(document.querySelector('#userInfo')),
                templateUrl: 'app/info/bottom-sheet-grid.html',
                controller: GridBottomSheetCtrl,
                clickOutsideToClose: true
            }).then(function(clickedItem) {
                switch(clickedItem['action']){
                    case 'changeImage':vm.changeImage();break;
                    case 'changePassword':vm.changepwd();break;
                    case 'signOut': vm.signOut();break;
                    default:$log.error('无效的按钮');
                }
            });
        }

        vm.optionsYearBar = {
            chart: {
                type: 'historicalBarChart',
                height: 400,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 50
                },
                x: function(d){return d[0];},
                y: function(d){return d[1]/100000;},
                showValues: true,
                valueFormat: function(d){
                    return d;
                },
                duration: 100,
                xAxis: {
                    axisLabel: '月份',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d))
                    },
                    rotateLabels: 30,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: '单子 (个)',
                    axisLabelDistance: -10,
                    tickFormat: function(d){
                        return  d;
                    }
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d3.time.format('%x')(new Date(d));
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 2],
                    useFixedDomain: false,
                    useNiceScale: true,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        vm.dataYearBar = [
            {
                "key" : "单子个数" ,
                "bar": true,
                "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            }];


        //BottomSheetController
        function GridBottomSheetCtrl($scope) {
            $scope.items = [
                {action:'changeImage', name: '更改头像', icon: 'photo_camera' },
                {action:'changePassword', name: '更改密码', icon: 'vpn_key' },
                {action:'signOut', name: '正常退出', icon: 'power_settings_new' }
            ];

            $scope.listItemClick = function($index) {
                var clickedItem = $scope.items[$index];
                $mdBottomSheet.hide(clickedItem);
            };
        }

        //修改密码controller
        function chgpwdDialogController($scope, $mdDialog, ModelCURD, user, UserAuthFactory, toastr) {
            $scope.submitFormChgPwd = function() {
                UserAuthFactory.checkPwd(user.account, $scope.inputOldPwd).success(function() {
                    var userCURD = ModelCURD.createCURDEntity('user');
                    userCURD.update({ id: user.id }, { newpwd: $scope.inputNewPwd }, function() {
                        toastr.success('密码修改成功');
                        $mdDialog.hide();
                    }, function(err) {
                        $log(err);
                        toastr.error('密码重置失败', '发生异常');
                    })
                }).error(function(err) {
                    toastr.error('旧密码验证失败');
                });
            }
        }


    }
})();
