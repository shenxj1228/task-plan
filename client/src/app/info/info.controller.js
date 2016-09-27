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
