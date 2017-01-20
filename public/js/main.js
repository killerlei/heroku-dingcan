/**
 * 入口文件
 * 2014-11-30 mon
 */
(function (window) {
    'use strict';

    require.config({

        //基本路径
        baseUrl: "js/",

        //模块标识名与模块路径映射
        paths: {
            //库
            "angular" : "libs/angular",
            "angular-route" : "libs/angular-route",
            "angular-messages" : "libs/angular-messages",
            'Swiper' : 'libs/swiper.min',

            //服务
            "mapService" : "services/mapService",
            "serverService" : "services/serverService",

            //控制器
            "app" : "controllers/app",
            "homeCtrl" : "controllers/homeCtrl",
            "personalCtrl" : "controllers/personalCtrl",
            "loginCtrl" : "controllers/loginCtrl",
            "feedbackCtrl" : "controllers/feedbackCtrl",
            "addrManageCtrl" : "controllers/addrManageCtrl",
            "addNewAddrCtrl" : "controllers/addNewAddrCtrl",
            "mapLocationCtrl" : "controllers/mapLocationCtrl",
            "orderConfirmCtrl" : "controllers/orderConfirmCtrl",
            "locationAddrCtrl" : "controllers/locationAddrCtrl",

            //路由
            "route" : "routes/appRoute",

            //工具
            'storageUtils' : 'util/storageUtils'
        },

        /*
         配置不兼容AMD的模块
         exports : 指定导出的模块名
         deps  : 指定所有依赖的模块的数组
         */
        shim: {
            'angular': {
                exports: 'angular'
            },
            'angular-route':{
                deps: ["angular"],
                exports: 'angular-route'
            },
            'angular-messages':{
                deps: ["angular"],
                exports: 'angular-messages'
            },
            'Swiper' : {
                exports : 'Swiper'
            }
        }
    });

    require(['angular','angular-route','angular-messages'
            ,'app','route','storageUtils', 'mapService','serverService'
            ,'homeCtrl','personalCtrl','loginCtrl','feedbackCtrl'
            ,'addrManageCtrl','addNewAddrCtrl','mapLocationCtrl'
            ,'orderConfirmCtrl','locationAddrCtrl'],

        function (angular){
            angular.bootstrap(document,["dcApp"]);
        }
    );
})(window)