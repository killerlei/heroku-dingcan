/*
总路由 : 加载并注册各个分路由
 */
var express = require('express');
var router = express.Router();

var user = require('./user');
var index = require('./index');
var address = require('./address');
var order = require('./order');

user(router);
index(router);
address(router);
order(router);

module.exports = router;
