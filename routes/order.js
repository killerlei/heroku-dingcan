/**
 * 处理订单模块的请求路由
 */
var db = require('../db/db');
var moment = require('moment');
module.exports = function (router) {
    //获取默认地址
    router.get('/order/getNewestAddress', function (req, res, next) {
        var userId = req.query.userId;
        db.getDefaultAddrByUserId(userId, function (address) {
            if(address==null) {
                res.send({
                    "code" : "1"
                });
            } else {
               res.send({
                   code : '0',
                   data : address
               });
            }
        });
    });


    //下单
    router.post('/order/createOrder', function (req, res, next) {
        var order = req.body.order;
        order.state = 3;//已完成
        db.addOrder(order, function (order) {
            res.send({
                code : '0',
                data : order
            });
        });
    });

    //查看订单详情
    router.get('/order/detail', function (req, res, next) {
        var id = req.query.id;
        db.getOrder(id, function (order) {
            console.log(order);

            var stateText = null;
            switch(order.state) {
                case 0:
                    stateText = '待支付';
                    break;
                case 1:
                    stateText = '已付款';
                    break;
                case 2:
                    stateText = '';
                    break;
                case 3:
                    stateText = '已完成';
                    break;
                case 4:
                    stateText = '店铺拒单';
                    break;
                case 5:
                    stateText = ' 商家已接单';
                    break;
                case 6:
                    stateText = '已退单';
                    break;
                case 7:
                    stateText = '未支付的取消订单';
                    break;
                case 8:
                    stateText = '订单异常';
                    break;
                case 9:
                    stateText = '退单中';
                    break;
                case 10:
                    stateText = '商家拒绝退单';
            }
            //添加新的属性数据
            order.stateText = stateText;
            //修改已有的属性数据
            order._doc.arrive_time = moment(order.arrive_time).format('HH:mm');
            order._doc.detail = JSON.parse(order.detail);

            res.render('orderDetail', order);
        });
    });

    //显示用户订单列表
    router.get('/order/orderList', function (req, res, next) {
        var userId = req.query.userId;
        db.getOrdersByUserId(userId, function (orderArr) {

            for (var i = 0; i < orderArr.length; i++) {
                var order = orderArr[i];

                order._doc.detail = JSON.parse(order.detail);
                order._doc.arrive_time = moment(order.arrive_time).format('MM-DD HH:mm');
                order._doc.order_time = moment(order.order_time).format('MM-DD HH:mm');
            }

            //使用ejs
            res.render('orderList', {code :0, data : orderArr});
        })
    });
}
