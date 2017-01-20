/**
 * Created by xfzhang on 2016/10/9.
 */
var connection = require('./connection');

var mongoose = connection.mongoose;

/*
 {
 "_id": {
 "$oid": "575f7085f8a14116283daba4"
 },
 "contactor": "张晓飞",
 "address": "平西府",
 "phone": "1310000000",
 "rstName": null,
 "remark": "不错不错",
 "doorplate": "硅谷大楼",
 "total_money": 65,
 "peisongfei": 0,
 "state": 3,
 "arrive_time": "2016-7-1 10:28",
 "detail": "{data:{\"rstId\":1,\"money\":65,\"meals\":[{\"mealId\":0,\"num\":1,\"price\":\"23\"},{\"mealId\":1,\"num\":2,\"price\":\"21\"}]}}",
 "user_id": "575f7085f8a14116283dabc4",
 "coupon_id": "575f7085f8a14116283dab23"
 }
 */
var orderSchema = new mongoose.Schema({
    "contactor": String,
    "address": String,
    "phone": String,
    "rstName": String,
    "remark": String,
    "doorplate": String,
    "total_money": Number,
    "peisongfei": Number,
    "state": Number,
    "arrive_time": Date,
    "detail": String,
    "user_id": String,
    "coupon_id": String
});

var OrderModel = mongoose.model('order', orderSchema);

function addOrder(order, callback) {
    new OrderModel(order).save(callback);
}
exports.addOrder = addOrder;

function getOrder(id, callback) {
    OrderModel.findOne({_id:id}, callback);
}
exports.getOrder = getOrder;

//根据userId查询对应的订单列表
function getOrdersByUserId(userId, fn) {
    OrderModel.find({user_id : userId}, fn);
}
exports.getOrdersByUserId = getOrdersByUserId;