/**
 * 路由
 */
define(['app'], function(app){
   return app.config(['$routeProvider',function($routeProvider) {
            $routeProvider
              .when('/home', {
                templateUrl: 'js/templates/home.html',
                controller: 'homeCtrl'
              })
              .when('/personal', {
                templateUrl: 'js/templates/personalCenter.html',
                controller: 'personalCtrl'
              })
              .when('/login', {
                templateUrl: 'js/templates/login.html',
                controller: 'loginCtrl'
              })
              .when('/feedback', {
                templateUrl: 'js/templates/feedback.html',
                controller: 'feedbackCtrl'
              })
              .when('/addr_manage', {
                templateUrl: 'js/templates/addrManage.html',
                controller: 'addrManageCtrl'
              })
              .when('/add_new_addr', {
                templateUrl: 'js/templates/addNewAddr.html',
                controller: 'addNewAddrCtrl'
              })
              .when('/map_location', {
                templateUrl: 'js/templates/mapLocation.html',
                controller: 'mapLocationCtrl'
              })
              .when('/order_confirm', {
                templateUrl: 'js/templates/orderConfirm.html',
                controller: 'orderConfirmCtrl'
              })
              .when('/loc_addr', {
                templateUrl: 'js/templates/locationAddr.html',
                controller: 'locationAddrCtrl'
              })
              .otherwise('/home');
   }])

})