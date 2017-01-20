/**
 * 操作users的dao模块
 */
var connection = require('./connection');

//测试 start
/*connection.connect();
function callback(error,user) {
    console.log(error, user);
}*/
//测试 end

//1. mongoose
var mongoose = connection.mongoose;

//2. schema
var Schema = mongoose.Schema;
    //{"_id": {"$oid": "576bbe0aa1d183c42c06c08e"}, "phone": "13716962779"}
var userSchema = new Schema({
    phone : String
});

//3. model
var UserModel = mongoose.model('user', userSchema);

//4. crud的方法
    //查询得到一个user
function getUser(phone,callback) {
    UserModel.findOne({phone:phone}, callback);
}
exports.getUser = getUser;
//getUser('13716962779',callback);

    //保存一个user
function addUser(phone, callback) {
    new UserModel({phone:phone}).save(callback);
}
exports.addUser = addUser;
//addUser('15011111111', callback);

