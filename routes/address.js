/**
 * 处理地址模块请求的分路由模块
 */
var db = require('../db/db');
module.exports = function (router) {

    //添加地址
    router.get('/insertAddr', function (req, res, next) {
        var address = JSON.parse(req.query.address);

        db.addAddress(address, function (address) {
            res.send({
                code : '0',
                data : address
            });
        })
    });

    //查询用户的地址列表
    router.get('/getAddrsByUserId', function (req, res, next) {
        var userId = req.query.userId;
        db.getAddressesByUserId(userId, function (addressArr) {
            res.send({
                code : '0',
                data : addressArr
            });
        })
    })

    //查看某个地址
    router.get('/getAddrById', function (req, res, next) {
        var id = req.query._id;

    })

    //修改地址
    router.get('/updateAddr', function (req, res, next) {
        var address = JSON.parse(req.query.address);
        db.updateAddress(address, function (msg) {
            res.send({
                code : '0',
                data : msg
            });
        })
    })

    //删除
    router.get('/deleteAddr', function (req, res, next) {
        var id = req.query._id;
        db.deleteAddressById(id, function (msg) {
            res.send({
                code : '0',
                data : msg
            });
        })
    })
}
