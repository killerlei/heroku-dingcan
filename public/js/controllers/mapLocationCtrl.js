define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('mapLocationCtrl', ['$scope','$rootScope', 'mapService',

        function ($scope,$rootScope, mapService) {

            $rootScope.headTitle = "地图定位";

            //计算出经纬度的初始值
            //得到首页定位的位置
            var locationAddress = storageUtils.session.getItem(storageUtils.KEYS.LOC_ADDR);
            if(locationAddress!=null) {
                var lng = locationAddress.lng;
                var lat = locationAddress.lat;
            }
            //地址添加页面传过来的位置
            var mapAddress = storageUtils.session.getItem(storageUtils.KEYS.MAP_ADDR);
            if(mapAddress!=null) {
                lng = mapAddress.lng;
                lat = mapAddress.lat;
            }

            loadJScript();

            function loadJScript() {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "http://api.map.baidu.com/api?v=2.0&ak=KM2xAiiLZnVowp1KzcNHeqSxziOXYXGL&callback=init";
                document.getElementById('map_div').appendChild(script);
            }

            var map = null;
             window.init = function () {
                console.log('加载地图完成');
                //1. 创建地图对象
                map = new BMap.Map("cc_map");
                //2. 设置中心点及缩放比例
                map.centerAndZoom(new BMap.Point(lng, lat), 15);
                map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
                //3. 添加监听
                //zoom
                map.addEventListener('zoomend', showAddrs)
                //drag
                map.addEventListener('dragend', showAddrs)

                $scope.$apply(function () {
                    showAddrs(); //显示列表
                })
            }

            /*
            显示地址列表
             */
            function showAddrs() {
                //得到当前的中心点
                var point = map.getCenter();
                //发送ajax请求, 得到附近的地址信息列表, 并显示
                mapService.getAddrs(point)
                    .then(function (addrs) {
                        $scope.addressArr = addrs;
                    })
            }

            /*
            查找
             */
            $scope.search = function () {
                mapService.locByAddr($scope.searchAddr)
                    .then(function (point) {
                        map.centerAndZoom(point, 15);
                        showAddrs();
                    });
            }

            /*
            选择某个地址
             */
            $scope.selectAddress = function (index) {
                var address = $scope.addressArr[index];
                var mapAddress = storageUtils.session.getItem(storageUtils.KEYS.MAP_ADDR);
                if(mapAddress!=null) {
                    storageUtils.session.setItem(storageUtils.KEYS.SEARCH_ADDR, address);
                    window.location = '#/add_new_addr';
                } else {
                    address.name = address.address;
                    storageUtils.session.setItem(storageUtils.KEYS.LOC_ADDR, address);
                    window.location = '#/home';
                }
            }
    }])
})