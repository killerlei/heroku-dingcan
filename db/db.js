/**
 * 数据库操作的总接口
 * 1. 收集各个dao的方法
 * 2. 统一处理异常
 */
var dao_user = require('./dao_user');
var dao_feedback = require('./dao_feedback');
var dao_address = require('./dao_address');
var dao_banner = require('./dao_banner');
var dao_meal = require('./dao_meal');
var dao_order = require('./dao_order');

module.exports = {
    getUser : function (phone, callback) {
        dao_user.getUser(phone, function (error, user) {
            if(error) {
                throw error;
            } else {
                callback(user);
            }
        })
    },

    addUser : function (phone, callback) {
        dao_user.addUser(phone, function (error, user) {
            if(error) {
                throw error;
            } else {
                callback(user);
            }
        })
    },

    addFeedback : function (feedback, callback) {
        dao_feedback.addFeedback(feedback, function (error, feedback) {
            if(error) {
                throw error;
            } else {
                callback(feedback);
            }
        })
    },

    getAddressesByUserId : function (userId, callback) {
        dao_address.getAddressesByUserId(userId, function (error, addressArr) {
            if(error) {
                throw error;
            } else {
                callback(addressArr);
            }
        })
    },
    
    addAddress : function (address, callback) {
        dao_address.addAddress(address, function (error, address) {
            if(error) {
                throw error;
            } else {
                callback(address);
            }
        })
    },
    
    updateAddress : function (address, callback) {
        dao_address.updateAddress(address, function (error, msg) {
            if(error) {
                throw error;
            } else {
                callback(msg);
            }
        })
    },

    deleteAddressById : function (id, callback) {
        dao_address.deleteAddressById(id, function (error, msg) {
            if(error) {
                throw error;
            } else {
                callback(msg);
            }
        })
    },

    getBanners : function (callback) {
        dao_banner.getBanners(function (error, banners) {
            if(error) {
                throw error;
            } else {
                callback(banners);
            }
        })
    },

    getMeals : function (callback) {
        dao_meal.getMeals(function (error, meals) {
            if(error) {
                throw error;
            } else {
                callback(meals);
            }
        })
    },
    getDefaultAddrByUserId : function (userId, callback) {
        dao_address.getDefaultAddrByUserId(userId, function (error, address) {
            if(error) {
                throw error;
            } else {
                callback(address);
            }
        });
    },

    addOrder : function (order, callback) {
        dao_order.addOrder(order, function (error, order) {
            if(error) {
                throw error;
            } else {
                callback(order);
            }
        });
    },

    getOrder : function (id, callback) {
        dao_order.getOrder(id, function (error, order) {
            if(error) {
                throw error;
            } else {
                callback(order);
            }
        });
    },

    getOrdersByUserId : function (userId, fn) {
        dao_order.getOrdersByUserId(userId, function (err, orderArr) {
            if(err) {
                throw err;
            } else {
                fn(orderArr);
            }
        })
    },
}