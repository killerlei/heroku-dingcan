/**
 * 操作addresses集合的dao模块
 */
var connection = require('./connection');
/*
connection.connect();
function callback(error, result) {
    console.log(error, result);
}
*/

//mongoose
var mongoose = connection.mongoose;

//Schema
    /*
     {
     "_id": {
     "$oid": "575f7085f8a14116283dab96"
     },
     "address": "北京大学-26号楼",
     "contactor": "张三",
     "lat": "39.993851111808",
     "lng": "116.31838249961 ",
     "phone": "17711111111",
     "sex": "1",
     "state": "1",
     "userId": "575f7085f8a14116283dabc7",
     "cityId": "113",
     "doorplate": "212"
     }
     */
var addressSchema = new mongoose.Schema({
    "address": String,
    "contactor": String,
    "lat": String,
    "lng": String,
    "phone": String,
    "sex": Number,
    "state": Number,
    "userId": String,
    "cityId": String,
    "doorplate": String
});

//model
var AddressModel = mongoose.model('address', addressSchema);

//CRUD

//地址列表
function getAddressesByUserId(userId, callback) {
    AddressModel.find({userId:userId}, callback);
}
exports.getAddressesByUserId = getAddressesByUserId;
//getAddressesByUserId('575f7085f8a14116283dabc7', callback);


//地址添加
function addAddress(address, callback) {
    new AddressModel(address).save(callback);
}
exports.addAddress = addAddress;
/*addAddress({
    "address": "尚硅谷大楼",
    "contactor": "张四",
    "lat": "39.993851111808",
    "lng": "116.31838249961 ",
    "phone": "17711111111",
    "sex": "1",
    "state": "1",
    "userId": "575f7085f8a14116283dabc7",
    "cityId": "113",
    "doorplate": "212"
}, callback);*/

//修改
function updateAddress(address, callback) {
    AddressModel.update({_id:address._id}, address, callback);
}
exports.updateAddress = updateAddress;
/*updateAddress({
    "_id": '575f7085f8a14116283dab96',
    "address": "北京大学-28号楼",
    "contactor": "张小二",
    "lat": "39.993851111808",
    "lng": "116.31838249961 ",
    "phone": "17711111111",
    "sex": "1",
    "state": "1",
    "userId": "575f7085f8a14116283dabc7",
    "cityId": "113",
    "doorplate": "212"
}, callback)*/

//删除
function deleteAddressById(id, callback) {
    AddressModel.remove({_id:id}, callback);
}
exports.deleteAddressById = deleteAddressById;
//deleteAddressById('57eb1e205b1ac5170844c020', callback);

//查找指定用户的默认地址
function getDefaultAddrByUserId (userId, callback) {
    AddressModel.findOne({userId : userId}, callback);
}
exports.getDefaultAddrByUserId = getDefaultAddrByUserId;