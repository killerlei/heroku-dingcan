define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('orderConfirmCtrl', ['$scope','$rootScope','serverService',
        function ($scope,$rootScope,serverService) {

            $rootScope.headTitle = "下单确认";

            //检查cart
            var cart = storageUtils.session.getItem(storageUtils.KEYS.CART);
            if(cart==null) {
                window.location = '#/home';
                return;
            }
            $scope.cart = cart;

            //检查用户是否登陆
            var user = storageUtils.local.getItem(storageUtils.KEYS.USER);
            if(user==null) {
                alert('请先登陆!');
                window.location = '#/login';
                return;
            }

            //检查session中是否有order_address
            var orderAddress = storageUtils.session.getItem(storageUtils.KEYS.ORDER_ADDR);
            if(orderAddress==null) {
                //根据userid查询对应的默认地址
                serverService.getDefaultAddr(user._id)
                    .then(function (result) {
                        if(result.code==1) {
                            alert('没有地址, 先添加');
                            window.location = '#/add_new_addr';
                        } else {
                            $scope.address = result.data;
                        }
                    });
            } else {
                $scope.address = orderAddress;
                storageUtils.session.removeItem(storageUtils.KEYS.ORDER_ADDR);
            }

            showTimes();


            /*
             显示时间列表
             */
            function showTimes() {
                var times = [];
                //{value:'2016-10-9 11:59', text: '立即配送'}
                //{value:'2016-10-9 12:14', text: '11:14'}
                var date = new Date();
                var year = date.getFullYear(); //哪年
                var month = date.getMonth()+1; //几月
                var day = date.getDate(); //几号
                var hour = date.getHours(); //几点
                var minute = date.getMinutes();//几分
                console.log(`${year}-${month}-${day} ${hour+1}:${minute}`);
                times.push({
                    value : `${year}-${month}-${day} ${hour+1}:${minute}`,
                    text : '立即配送'
                });

                //最晚的送餐 : 20:00   间隔时间15
                var intervalTime = 15;  //min
                var startTime = date.getTime();
                var endTime = new Date(`${year}-${month}-${day} 22:00`).getTime();
                var count = (endTime-startTime)/(intervalTime*60*1000)-1;
                for(let i=0;i<count;i++) {
                    minute += intervalTime;
                    if(minute>=60) {
                        hour++;
                        minute -= 60;
                    }
                    times.push({
                        value : `${year}-${month}-${day} ${hour+1}:${minute}`,
                        text : `${hour}:${minute<10?'0'+minute:minute}`
                    });
                }

                $scope.times = times;
            }

            $scope.addOrder = function () {

                //准备订单详情数据
                var detail = {
                    data : {
                        rstId : $scope.cart.rstId,
                        money : $scope.cart.totalPrice+$scope.cart.songcanfei,
                        meals : $scope.cart.meals
                    }
                };
                //准备订单对象
                var order = {
                    "user_id": user._id,

                    "contactor": $scope.address.contactor,
                    "address": $scope.address.address,
                    "phone": $scope.address.phone,
                    "doorplate": $scope.address.doorplate,

                    "total_money": $scope.cart.totalPrice,
                    "peisongfei": $scope.cart.songcanfei,

                    "remark": $scope.remark,
                    "arrive_time": $scope.deliverTime,

                    "detail": JSON.stringify(detail)
                };

                serverService.createOrder(order)
                    .then(function (result) {
                        alert('下单成功');
                        storageUtils.session.removeItem(storageUtils.KEYS.CART);
                        storageUtils.session.removeItem(storageUtils.KEYS.ORDER_ADDR);

                        window.location = '/order/detail?id='+result.data._id;
                    });
            }
    }])
})