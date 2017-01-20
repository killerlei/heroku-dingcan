define(['app'], function (app) {

    app.factory('mapService', ['$http','$q', function($http,$q) {

        /*
        得到当前坐标点附近的一些地址
         */
        function getAddrs(point) {
            var def = $q.defer();
            var url = 'http://api.map.baidu.com/geocoder/v2/?' +
                'ak=KM2xAiiLZnVowp1KzcNHeqSxziOXYXGL&callback=JSON_CALLBACK&' +
                'location='+point.lat+','+point.lng+'&output=json&pois=1';
            $http.jsonp(url)
                .success(function (data) {
                    //console.log(data);
                    var addressArr = [];
                    var cityId = data.result.cityCode;
                    data.result.pois.forEach(function (item) {
                        var name = item.name;
                        var lng = item.point.x;
                        var lat = item.point.y;
                        addressArr.push({
                            address : name,
                            lng : lng,
                            lat : lat,
                            cityId : cityId
                        });
                    })
                    def.resolve(addressArr)
                })
                .error(function () {
                    alert('查找地址失败!');
                });
            return def.promise;
        }

        /*
        根据地址在地图上定位
         */
        function locByAddr(addr) {

            var def = $q.defer();
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(addr, function(point){
                if (point) {
                    def.resolve(point);
                }else{
                    alert("您选择地址没有解析到结果!");
                }
            }, "北京市");

            return def.promise;
        }

        /*
            获取当前的地址
         */
        function getCurrAddr(id) {

            var def = $q.defer();

            //给window添加方法,作为map的回调函数
            window.showCurrentAddr = function () {
                //得到当前的位置
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(result){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){ //成功了
                        var point = result.point;
                        //根据point进行逆地址解析
                        var geoc = new BMap.Geocoder();
                        geoc.getLocation(point, function(rs){
                            var addComp = rs.addressComponents;
                            console.log(addComp.province + ", " + addComp.city + ", "
                                + addComp.district + ", " + addComp.street + ", "
                                + addComp.streetNumber);
                            var name = addComp.district +addComp.street+addComp.streetNumber;
                            def.resolve({name, point});
                        });
                    } else {
                        alert('定位失败!');
                        def.reject();
                    }
                },{enableHighAccuracy: true})
            }

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://api.map.baidu.com/api?" +
                "v=2.0&ak=G0x6FmDVrESWqmtOuLAUGAdvTSEQPXbU&callback=showCurrentAddr";
            document.getElementById(id).appendChild(script);

            return def.promise;
        }

        /*
        得到周围地址
         */
        function getAroundAddrs(address) {
            var def = $q.defer();
            var url = 'http://api.map.baidu.com/place/v2/search?q='
                +address+'&region=北京&output=json&ak=aDvS9fDTEwGEUFRiVlTt6koBLHTcYTny' +
                '&callback=JSON_CALLBACK';
            $http.jsonp(url)
                .success(function (data) {
                    var aroundAddrArr = [];
                    data.results.forEach(function (item) {
                        aroundAddrArr.push({
                            name : item.name,
                            lat : item.location.lat,
                            lng : item.location.lng
                        });
                    });
                    def.resolve(aroundAddrArr);
                })
                .error(function () {
                    alert('请求附近地址列表失败');
                });
            return def.promise;
        }

        return {getAddrs, locByAddr, getCurrAddr, getAroundAddrs};
    }])

})
