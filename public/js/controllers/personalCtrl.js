define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('personalCtrl', ['$scope','$rootScope', function ($scope,$rootScope) {

        $rootScope.headTitle = "个人中心";

        var user = storageUtils.local.getItem(storageUtils.USER_KEY);
        if(user==null) {
            alert('请先登陆');
            window.location = '#/login';
            return;
        }

        $scope.user = user;

        $scope.showOrders = function () {
            window.location = '/order/orderList?userId='+$scope.user._id;
        }

        $scope.showAddresses = function () {
            window.location = '#/addr_manage';
        }

        $scope.toFeedBack = function () {
            window.location = '#/feedback';
        }
    }])
})