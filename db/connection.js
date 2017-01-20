/**
 * 连接数据库的模块
 */
//引入mongoose
var mongoose = require('mongoose');

//导出mongoose
exports.mongoose = mongoose;

//导出连接数据库
function connect() {
    //连接数据库
    mongoose.connect('mongodb://127.0.0.1/atguigu_o2o2');
    //得到连接对象
    var connection = mongoose.connection;
    //监听连接失败
    connection.on('error', console.error.bind(console, 'connection error:'));
    //监听连接成功
    connection.once('open', function (callback) {
        console.log('we are connected');
    });
}
exports.connect = connect;
//connect();

//导出断开连接
function disconnect() {
    mongoose.disconnect();
}
exports.disconnect = disconnect;
//disconnect();