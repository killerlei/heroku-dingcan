define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('addNewAddrCtrl', ['$scope','$rootScope','serverService',
        function ($scope,$rootScope, serverService) {

            //读取session中_edit_address_
            var editAddress = storageUtils.session.getItem(storageUtils.KEYS.EDIT_ADDR);
            if(editAddress===null) { //新增
                $rootScope.headTitle = "新增地址";
                $scope.btnAction = '保 存';
                var user = storageUtils.local.getItem(storageUtils.KEYS.USER);
                //初始化address
                $scope.address = {
                    "userId": user._id,
                    "lat": 39.99392711698915,
                    "lng": 116.32432928208593,
                    "cityId": 113,
                    'sex' : 1
                };
            } else { //更新
                $rootScope.headTitle = "修改地址";
                $scope.btnAction = '更 新';
                $scope.address = editAddress;
            }

            //从地图界面过来
            var mapAddress = storageUtils.session.getItem(storageUtils.KEYS.MAP_ADDR)
            if(mapAddress != null) {
                $scope.address = mapAddress;
                storageUtils.session.removeItem(storageUtils.KEYS.MAP_ADDR);
            }
            var searchAddress = storageUtils.session.getItem(storageUtils.KEYS.SEARCH_ADDR);
            if(searchAddress!=null) {
                $scope.address.address = searchAddress.address;
                $scope.address.lng = searchAddress.lng;
                $scope.address.lat = searchAddress.lat;
                $scope.address.cityId = searchAddress.cityId;
                storageUtils.session.removeItem(storageUtils.KEYS.SEARCH_ADDR); //删除
            }

            //设置性别
            $scope.setSex = function (sex) {
                $scope.address.sex = sex;
            }

            //提交请求
            $scope.submit = function () {
                if(editAddress===null) {
                    console.log('添加地址');
                    serverService.insertAddr($scope.address)
                        .then(result => {
                            alert('保存成功');
                            window.location = '#/addr_manage';
                        })
                } else {
                    console.log('更新地址');
                    //删除保存的地址
                    storageUtils.session.removeItem(storageUtils.KEYS.EDIT_ADDR);
                    serverService.updateAddr($scope.address)
                        .then(result => {
                            alert('更新成功');
                            window.location = '#/addr_manage';
                        })
                }
            }

            $scope.toMap = function () {
                //$scope.address.address = '北京昌平';
                storageUtils.session.setItem(storageUtils.KEYS.MAP_ADDR, $scope.address);
                window.location = '#/map_location';
            }
    }])
})