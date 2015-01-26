"use strict";

var http = require("http");
var querystring = require('querystring');

var ttl = 24 * 60 * 60; // last data cache ttl 24 hours

var healthKettleMessage = [
    '',
    '开水已备好，请享用',
    '欢迎下次打边炉',
    '花茶已备好，请享用',
    '水果茶已备好，请享用',
    '米酒已酿好，请享用',
    '纳豆已备好，请享用',
    '药膳已煮好，请享用',
    '鸡蛋已煮好，请享用',
    '汤已好，味正浓，请享用',
    '粥已出锅，请享用',
    '酸奶已好，请享用',
    '鸡蛋已蒸好，请享用'
];

module.exports = function () {
    var napp = this;
    var log = napp.log.get('kettle:data');
    var dataBucket = napp.store.createBucket("kettle:data", {ttl: ttl}); // seconds

    // update last data on node:data

    var channel = napp.bus.subscribe('node');
//    channel.on('data', function (message) {
//        if (message) {
//            rulen.process(message);
//        }
//    });
    channel.on('data', function (message) {
        if (message.data.D == 50004) {
            return;

            var key = cacheKey(message.owner, message.guid);
            dataBucket.get(key, function (err, value) {
                if (!value) {
                    dataBucket.set(key, message.data, function (err) {
                        if (err) throw err;
                    });
                    return;
                }
                if (err) {
                    if (err) throw err;
                }
                try {
                    var newValue = (typeof(message.data.DA) == 'string') ? JSON.parse(message.data.DA) : message.data.DA;
                    var oldValue = (typeof(value.DA) == 'string') ? JSON.parse(value.DA) : value.DA;
                    oldValue.notify = value.notify;
                    if (newValue.onoff == 'on') {
                        if (oldValue.target != 0 && newValue.target == 0 && !newValue.heating && !newValue.boil && !newValue.keepwarm) {
                            notifyTarget(message.owner, oldValue.target);
                        } else if (newValue.keepwarm && newValue.target && oldValue.keepwarm && (oldValue.target == newValue.target)) {
                            if (!newValue.boil && !newValue.heating && oldValue.heating && (newValue.temperature - newValue.target) < 2) {
                                if (!oldValue.notify) {
                                    notifyKeepwarm(message.owner, oldValue.target);
                                }
                                message.data.notify = true;
                            }
                        } else if (!newValue.keepwarm && newValue.target == 0 && oldValue.boil && !newValue.boil) {
                            notifyBoiled(message.owner);
                        }
                        if (newValue.keepwarm && newValue.target && oldValue.keepwarm && (oldValue.target == newValue.target)) {
                            if (oldValue.notify) {
                                message.data.notify = true;
                            }
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
                dataBucket.set(key, message.data, function (err) {
                    if (err) throw err;
                });
            });
        } else if (message.data.D == 4000) {
            var key = cacheKey(message.owner, message.guid);
            dataBucket.get(key, function (err, value) {
                if (!value) {
                    dataBucket.set(key, message.data, function (err) {
                        if (err) throw err;
                    });
                    return;
                }
                if (err) {
                    if (err) throw err;
                }
                try {
                    var newValue = (typeof(message.data.DA) == 'string') ? JSON.parse(message.data.DA) : message.data.DA;
                    var oldValue = (typeof(value.DA) == 'string') ? JSON.parse(value.DA) : value.DA;
                    oldValue.notify = value.notify;
                    if (newValue.state == 3 && oldValue.state != 3) {
                        if (oldValue.fn >= 0 && oldValue.fn < 13) {
                            sendNotification(message.owner, healthKettleMessage[oldValue.fn]);
                            var post_data = querystring.stringify({
                                msg: healthKettleMessage[oldValue.fn],
                                open_id: message.owner
                            });
                            var options = {
                                hostname: 'device.vguang.com',
                                port: 80,
                                path: '/api/sendmsg',
                                method: 'POST',
                                headers: {
                                    "Content-Type": 'application/x-www-form-urlencoded',
                                    "Content-Length": post_data.length
                                }
                            };
                            var req = http.request(options, function (res) {
                                res.setEncoding('utf8');
                                res.on('data', function (chunk) {
                                    console.log('BODY: ' + chunk);
                                });

                            });

                            req.on('error', function (error) {
                                console.log('Error: ' + error);
                            });

                            console.log(post_data);
                            req.write(post_data + "\n");
                            req.end();
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
                dataBucket.set(key, message.data, function (err) {
                    if (err) throw err;
                });
            });
        }
    });

    function notifyTarget(owner, target) {
        var message = "您的需要的" + target + "度开水已经准备好，请及时用水";
        sendNotification(owner, message);
    }

    function notifyKeepwarm(owner, target) {
        var message = "您的需要的开水已经准备好，已保温在" + target + "度，请及时用水";
        sendNotification(owner, message);
    }

    function notifyBoiled(owner) {
        var message = "您的需要的开水已经烧开，请及时用水";
        sendNotification(owner, message);
    }

    function sendNotification(owner, message) {
        napp.rekuest("kettleSettings.find")
            .prop("ownerId", owner)
            .send(function (err, result) {
                if (err) {
                    if (err) throw err;
                }
                var kettleState = result.data || result;
                if (kettleState.notify) {
                    if (napp.pusher) {
                        napp.pusher.notify(owner, message, function (err) {
                            if (log.isDebugEnabled()) {
                                log.debug(err);
                            }
                        });
                    }
                }
            });
    }

};

function cacheKey() {
    return Array.prototype.slice.call(arguments).join(':');
}