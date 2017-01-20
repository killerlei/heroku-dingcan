/**
 * Created by xfzhang on 2016/10/8.
 */
var md5 = require('blueimp-md5');
var moment = require('moment');
var Base64 = require('js-base64').Base64;
var request = require('request');

/*
生成指定位数的随机数(验证码)
 */
function randomCode(length) {
    var chars = ['0','1','2','3','4','5','6','7','8','9'];
    var res = "";
    for(var i = 0; i < length ; i ++) {
        var index = Math.ceil(Math.random()*9);
        res += chars[index];
    }
    return res;
}
exports.randomCode = randomCode;
//console.log(randomCode(6));

/*
发送验证码短信
 */
function sendCode(code, phone, callback) {

    const ACCOUNT_SID = '8aaf070855b647ab0155b9f80994058a';
    const AUTH_TOKEN = 'aa8aa679414e49df8908ea5b3d043c24';
    const Rest_URL = 'https://app.cloopen.com:8883';
    const AppID = '8aaf070855b647ab0155b9f809f90590';

    //1. 准备url
        //.使用MD5加密（账户Id + 账户授权令牌 + 时间戳）
        //时间戳是当前系统时间，格式"yyyyMMddHHmmss"。时间戳有效时间为24小时，如：20140416142030
    var time = moment().format('YYYYMMDDHHmmss');
    var sigParameter = md5(ACCOUNT_SID+AUTH_TOKEN+time);
    var url = `${Rest_URL}/2013-12-26/Accounts/${ACCOUNT_SID}/SMS/TemplateSMS?sig=${sigParameter}`;
    //2. 准备请求体
    var body = {
        to : phone,
        appId : AppID,
        templateId : '1',
        datas : [code, '1']
    };
    //3. 准备请求头
        /*
         1.使用Base64编码（账户Id + 冒号 + 时间戳）其中账户Id根据url的验证级别对应主账户
         2.冒号为英文冒号
         3.时间戳是当前系统时间，格式"yyyyMMddHHmmss"，需与SigParameter中时间戳相同
         */
    var authorization = Base64.encode(ACCOUNT_SID+":" + time);
    var headers = {
        Accept : 'application/json',
        'Content-Type' : 'application/json;charset=utf-8',
        'Content-Length' : JSON.stringify(body).length+"",
        Authorization : authorization

    };

    //4. 发送post请求
    var options = {
        url : url,
        method : 'POST',
        headers : headers,
        body : body,
        json : true
    };
    /*request(options, function (error, response, body) {
        console.log(error, response, body);
        callback(body.statusCode=='000000');
    })*/
    callback(true);
}
exports.sendCode = sendCode;
/*
sendCode(randomCode(6), '13716962779', function (success) {
    console.log(success);
})*/
