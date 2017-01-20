define(['app', 'storageUtils'], function (app,storageUtils) {
    return app.controller('loginCtrl', ['$scope','$rootScope','$interval','serverService',
        function ($scope,$rootScope,$interval,serverService) {

            $rootScope.headTitle = "登陆";

            $scope.timing = false; //计时标识
            $scope.btnText = '获取验证码'; //button的文本

            $scope.startTiming = function () {
                //* 检查手机号是正常输入, 如果不合法提示信息
                if($scope.loginForm.phone.$invalid) {
                    $scope.loginForm.phone.$dirty = true;
                    return;
                }
                //* 开始计时: 更新timing, 使用$interval启动定时器更新btnText
                this.timing = true;
                var time = 60;
                //time = 10; //测试
                $scope.btnText = time+'s重新获取';
                var stop = $interval(function () {
                    time--;
                    $scope.btnText = time+'s重新获取';

                    //* 结束定时: 当时间到0时
                    //console.log(time);
                    if(time==0) {

                        $interval.cancel(stop); //取消定时器

                        $scope.timing = false;
                        $scope.btnText = '获取验证码';
                    }
                }, 1000);

                //发ajax请求, 发送验证码
                serverService.sendCode($scope.user.phone)
                    .then(function (result) {
                        console.log(result);
                    });
            }

            //登陆
            $scope.login = function () {
                serverService.login($scope.user)
                    .then(
                        function (result) {
                            var code = result.code;
                            if(code==1) {
                                alert('验证码不正确!');
                            } else {
                                //得到user
                                var user = result.data;
                                alert(user.phone+', 登陆成功!');
                                //保存
                                storageUtils.local.setItem(storageUtils.USER_KEY, user);
                                //跳转到index.html
                                window.location = '#/home';
                            }
                        },
                        function () {
                            alert('登陆失败!');
                        }
                    )
            }
        }])
})