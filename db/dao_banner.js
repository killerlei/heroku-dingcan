/**
 * 操作index_banners的dao模块
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
 "$oid": "575f7085f8a14116283dab9c"
 },
 "img_src": "/assets/images/img/bar1.jpg",
 "link": null,
 "sort": true
 }
 */
var bannerSchema = new mongoose.Schema({
    "img_src": String,
    "link": String,
    "sort": Boolean
});

var BannerModel = mongoose.model('index_banner', bannerSchema);

function getBanners(callback) {
    BannerModel.find(callback);
}
exports.getBanners = getBanners;
//getBanners(callback);