define(['app', 'storageUtils'], function (app,storageUtils) {
    return app.controller('addrManageCtrl', ['$scope','$rootScope','serverService',
        function ($scope,$rootScope, serverService) {

            $rootScope.headTitle = "地址管理";

            //删除session中保存的address
            storageUtils.session.removeItem(storageUtils.KEYS.EDIT_ADDR);

            //得到userId
            var user = storageUtils.local.getItem(storageUtils.KEYS.USER);
            var userId = user._id;

            //ajax请求获取地址列表
            serverService.getAddrsByUserId(userId)
                .then(result => $scope.addressArr = result.data)

            //新增地址
            $scope.addAddr = function () {
                window.location = '#/add_new_addr';
            };

            //删除一个地址
            $scope.deleteAddr = function (index) {
                var address = $scope.addressArr[index];
                if(confirm('确定要删除'+address.contactor+'的地址吗?')) {
                    serverService.deleteAddr(address._id)
                        .then(result => {
                            alert('删除成功');
                            $scope.addressArr.splice(index, 1);
                        })
                }
            };

            //修改
            $scope.toUpdateAddr = function (address) {
                //保存-->sessionStorage
                storageUtils.session.setItem(storageUtils.KEYS.EDIT_ADDR, address);
                //跳转到添加地址页面
                window.location = '#/add_new_addr';
            }

            //去订单确定界面
            $scope.toOrderConfirm = function (address) {
                storageUtils.session.setItem(storageUtils.KEYS.ORDER_ADDR, address);
                window.location = '#/order_confirm';
            }
    }])
})