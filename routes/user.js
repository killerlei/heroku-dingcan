/**
 * user模块的路由
 */
var db = require('../db/db');
var sms_utils = require('../util/sms_utils');

module.exports = function (router) {//注册路由

    /*
    登陆
     phone=13716962779&code=123123
     {
         "code": 0,
         "data": {
         "__v": 0,
         "phone": "13716962779",
         "_id": "576bbe0aa1d183c42c06c08e"
         }
     }
     */
    router.post('/login', function (req, res, next) {
        //1. 获取请求参数数据
        var phone = req.body.phone;
        var code = req.body.code;
        console.log('/login', phone, code);

        //判断code是否正确
        var savedCode = users[phone];
        if(code!=savedCode) { //如果不同, 返回错误
            res.send({
                code : '1',
            });
            return;
        }
        //删除验证码
        delete users[phone];

        //2. 处理数据
        db.getUser(phone, function (user) {
            if(user===null) { //不存在此用户, 需要保存
                //3. 返回响应数据
                db.addUser(phone, function (user) {
                    res.send({
                        code : '0',
                        data : user
                    });
                })
            } else {
                //3. 返回响应数据
                res.send({
                    code : '0',
                    data : user
                });
            }
        })
    });

    /*
    意见反馈
     */
    router.get('/feedback', function (req, res, next) {
        var feedback = JSON.parse(req.query.data);
        console.log('/feedback', feedback);

        db.addFeedback(feedback, function (feedback) {
           res.send({
               code : '0',
               data : feedback
           });
        });
    });


    /*
    发送验证码短信
     */
    var users = {};
    router.get('/sendcode', function (req, res, next) {
        var phone = req.query.phone;
        //生成验证码(6位随机的数)
        var code = sms_utils.randomCode(6);
        //发送短信
        sms_utils.sendCode(code, phone, function (success) {//success是否成功
            if(success) {
                console.log(phone, '验证码: '+code);
                //保存手机与验证码
               users[phone] = code;
                //启动定时器, 60秒后自动删除保存的code
                /*setTimeout(function () {
                    delete users[phone];
                }, 60);*/
            }
        })
        res.send({
            code : '0'
        });
    })

}
