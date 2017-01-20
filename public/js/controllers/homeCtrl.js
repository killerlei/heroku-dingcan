define(['app', 'storageUtils', 'Swiper'], function (app,storageUtils,Swiper) {
    return app.controller('homeCtrl', ['$scope','$rootScope', 'serverService', 'mapService','$timeout',
        function ($scope,$rootScope,serverService,mapService, $timeout) {

            $rootScope.headTitle = "首页";

            //初始化购物车
            initCart();

            //异步请求,获取远程数据
            ajaxData();

            /*
             更新购物项的数量
             */
            var totalCountDiv = angular.element(document.getElementById('total_count'));
            var body = angular.element(document.getElementById('home'));
            $scope.addItemCount = function(item, isAdd, event){
                var a = angular.element(event.target);
                //克隆一个
                var flyA = a.clone().addClass('jia-fly').html(1);
                //添加到页面
                body.append(flyA);

                //初始化定位
                var startLeft = a[0].getBoundingClientRect().left;
                var startTop = a[0].getBoundingClientRect().top;
                flyA.css({
                    left : startLeft + 'px',
                    top : startTop + 'px'
                });

                //计算结束位置的坐标
                var endLeft = totalCountDiv[0].getBoundingClientRect().left;
                var endTop = totalCountDiv[0].getBoundingClientRect().top;

                //准备移动
                var totalTime = 300;
                var count = 30;
                var intervalTime = totalTime/count;
                var intervalX = (endLeft-startLeft)/count;
                var intervalY = (endTop-startTop)/count;
                var intervalId = setInterval(function () {
                    startLeft += intervalX;
                    startTop += intervalY;
                    if(startLeft<=endLeft) {
                        startLeft = endLeft;
                        startTop = endTop;
                        clearInterval(intervalId);
                    }
                    flyA.css({
                        left : startLeft + 'px',
                        top : startTop + 'px'
                    });
                }, intervalTime);

                $timeout(function () {

                    flyA.remove();//移除

                    var dMeals = $scope.data.meals;
                    var cMeals = $scope.cart.meals;

                    //var item = dMeals[index];
                    if(isAdd) {
                        if(!item.count) {  //第一次
                            item.count = 0;
                            //放入cart中
                            cMeals.push(item);
                        }
                        item.count++;

                        //更新购物车中的总数量和总价格
                        $scope.cart.totalCount++;
                        $scope.cart.totalPrice += item.price;
                    } else {
                        item.count--;
                        if(item.count==0) {
                            //从cart中移除item
                            for(var i=0;i<cMeals.length;i++) {
                                if(cMeals[i]===item) {
                                    //删除
                                    cMeals.splice(i, 1);
                                    break;
                                }
                            }
                            delete item.count;   //删除item中count属性
                        }
                        //更新购物车中的总数量和总价格
                        $scope.cart.totalCount--;
                        $scope.cart.totalPrice -= item.price;

                        if($scope.cart.totalCount==0) {
                            $scope.isOpen = false;
                        }
                    }
                    //保存cart
                    sessionStorage.setItem('_cart_', JSON.stringify($scope.cart));
                }, totalTime+60);
            }

            /*
            切换购物车的显示/隐藏
             */
            $scope.isOpen = false;
            $scope.showCart = function () {
                $scope.isOpen = !$scope.isOpen;
            }

            /*
            去下单
             */
            $scope.toconfirmOrder = function () {
                if($scope.cart.totalCount>0) {
                    window.location = '#/order_confirm';
                }
            };

            /*
             异步请求,获取远程数据
             */
            function ajaxData() {
                //ajax请求得到banners
                serverService.getBanners()
                    .then(function (result) {
                        $scope.banners = result.data;

                        //创建Swiper对象, 实现轮播
                        setTimeout(function(){
                            new Swiper('#bannerSwiper', {
                                direction : 'horizontal', //方向:水平
                                autoplay : 4000, //自动翻页的间隔时间: 4s
                                autoplayDisableOnInteraction : false, //用户操作后是否停止
                                effect : 'cube', //效果: 立体
                                loop : true, //是否循环: 循环
                                pagination : '.swiper-pagination', //包含提示器圆点的div
                                paginationClickable : true //分页指示器是否可以点击切换: 可以
                            })
                        }, 100)
                    });

                //ajax请求得到index/data
                serverService.getHomeData()
                    .then(function (result) {
                        $scope.data = result.data;

                        //保存商家的id
                        $scope.cart.rstId = $scope.data.restaurant._id;
                        //保存送餐费
                        $scope.cart.songcanfei = $scope.data.restaurant.songcanfei;

                        //更新data中meals
                        updateDMeals();

                        var locationAddress = storageUtils.session.getItem(storageUtils.KEYS.LOC_ADDR);
                        if(locationAddress!=null) {
                            $scope.data.address = locationAddress;
                        } else {
                            storageUtils.session.setItem(storageUtils.KEYS.LOC_ADDR, $scope.data.address);
                            //请求百度地图js
                            loadJScript();
                        }
                    })
            }

            /*
             初始化购物车
             */
            function initCart() {
                //从session中读取cart数据
                var cart = storageUtils.session.getItem(storageUtils.KEYS.CART);
                if(cart==null) {
                    $scope.cart = {
                        meals : [],
                        "songcanfei": 0,
                        "totalPrice": 0,
                        "totalCount": 0,
                        "rstId": null
                    }
                } else {
                    $scope.cart = cart;
                }
            }

            /*
             更新dat中meals
             */
            function updateDMeals() {
                var dMeals = $scope.data.meals;
                var cMeals = $scope.cart.meals;
                for(var i=0;i<dMeals.length;i++) {
                    var dMeal = dMeals[i];
                    for(var j=0;j<cMeals.length;j++) {
                        var cMeal = cMeals[j];
                        if(dMeal._id===cMeal._id) {
                            dMeals[i] = cMeal;
                            break;
                        }
                    }
                }
            }

            /*
            异步加载百度地图js, 获取当前地址显示
             */
            function loadJScript() {
                $scope.data.address.name = '正在定位中...';

                mapService.getCurrAddr('home')
                    .then(function (result) {

                        $scope.data.address.name = result.name;
                        //保存当前的位置
                        var locationAddress = {
                            name : result.name,
                            lng : result.point.lng,
                            lat : result.point.lat
                        };
                        storageUtils.session.setItem(storageUtils.KEYS.LOC_ADDR, locationAddress);
                    })

            }
    }])
})