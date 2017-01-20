define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('locationAddrCtrl', ['$scope','$rootScope','serverService','mapService',
        function ($scope, $rootScope, serverService, mapService) {

            $rootScope.headTitle = "选择地址";

            //检查用户是否登陆
            var user = storageUtils.local.getItem(storageUtils.KEYS.USER);
            if(user==null) {
                alert('请先登陆!');
                window.location = '#/login';
                return;
            }

            //显示地址列表
            serverService.getAddrsByUserId(user._id)
                .then(function (result) {
                    $scope.addressArr = result.data;
                });

            //显示当前地址
            var locationAddr = storageUtils.session.getItem(storageUtils.KEYS.LOC_ADDR);
            $scope.locationAddr = locationAddr;

            showAroundAddrs($scope.locationAddr.name);

            $scope.showSearch = false;
            $scope.search = function () {
                var searchText = $scope.searchText;
                if(searchText.trim()==='') {
                    return;
                }
                $scope.showSearch = true;
                showAroundAddrs(searchText, 'searchAddrArr');
            }

            //取消搜索
            $scope.cancelSearch = function () {
                $scope.showSearch = false;
                $scope.searchText = '';
                $scope.searchAddrArr = null;
            }


            $scope.locating = false;
            //重新定位
            $scope.relocation = function () {
                $scope.locating = true;

                mapService.getCurrAddr('loc_addr_div')
                    .then(function (result) {
                        $scope.locationAddr.name = result.name;

                        //保存地址到sessionStorage
                        $scope.locationAddr.lat = result.point.lat;
                        $scope.locationAddr.lng = result.point.lng;
                        $scope.locating = false;

                        showAroundAddrs($scope.locationAddr.name, 'aroundAddrArr');
                    }, function () {
                        $scope.$apply(function () {
                            $scope.locating = false;
                        });
                    });
            };

            /*
            进入首页
             */
            $scope.toIndex = function (address) {
                var addr = {
                    name : address.address || address.name,
                    lat : address.lat,
                    lng : address.lng
                };
                storageUtils.session.setItem(storageUtils.KEYS.LOC_ADDR, addr);
                window.location = '#/home';
            }

            /*
             得到附近地址列表
             */
            function showAroundAddrs(address, addrsName) {
                mapService.getAroundAddrs(address)
                    .then(function (addrs) {
                        $scope[addrsName] = addrs;
                    });
            }
    }])
})