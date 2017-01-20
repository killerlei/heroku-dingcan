/**
 * 操作meals的dao模块
 */
var connection = require('./connection');
/*
connection.connect();
function callback(error, result) {
    console.log(error, result);
}
*/

var mongoose = connection.mongoose;
/*
 {
 "_id": {
 "$oid": "575f7085f8a14116283dab9e"
 },
 "group_id": 0,
 "groupName": "",
 "mealCode": "",
 "mealType": "1",
 "mealName": "熏鸡肉沙拉",
 "price": "23",
 "originalPrice": "28",
 "picture": "/assets/images/img/1.png",
 "instruction": null,
 "sales": "256",
 "state": null
 }
 */
var mealSchema = new mongoose.Schema({
    "group_id": Number,
    "groupName": String,
    "mealCode": String,
    "mealType": String,
    "mealName": String,
    "price": Number,
    "originalPrice": Number,
    "picture": String,
    "instruction": String,
    "sales": Number,
    "state": String
});

var MealModel = mongoose.model('meal', mealSchema);

function getMeals(callback) {
    MealModel.find(callback);
}
exports.getMeals = getMeals;
//getMeals(callback);