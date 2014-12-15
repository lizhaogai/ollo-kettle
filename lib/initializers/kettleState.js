"use strict";

var events = require('../events');
var ttl = 24 * 60 * 60; // last data cache ttl 24 hours

module.exports = function () {
    var napp = this;
    var dataBucket = sapp.store.createBucket("kettle:data", {ttl: ttl}); // seconds

    // update last data on node:data
    napp.on(events.NODE_DATA, function (message) {
        var key = cacheKey(message.owner, message.guid);

        dataBucket.get(key, function (err, value) {
            if (err) {
                if (err) throw err;
            }

            dataBucket.set(key, message.data, function (err) {
                if (err) throw err;
            });

            var newValue = (typeof(message.data) == 'string') ? JSON.parse(message.data) : message.data;
            var oldValue = (typeof(value) == 'string') ? JSON.parse(value) : value;

            if (newValue.onoff == 'on') {
                if (oldValue.target != 0 && newValue.target == 0) {
                    notifyTarget(message.owner, oldValue.target);
                } else if (message.owner, newValue.keepwarm) {
                    if (!newValue.boil && !newValue.heating && oldValue.heating) {
                        notifyKeepwarm(newValue.target);
                    }
                } else if (!keepwarm && target == 0 && oldValue.boil && !newValue.boil) {
                    notifyBoiled(message.owner);
                }
            }
        });

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
        var KettleSettings = napp.getModel('KettleSettings');
        KettleSettings.get(owner, function (err, kettleSetting) {
            if (err) {
                if (err) throw err;
            }

            if (kettleSetting.notify) {
                if (napp.pusher) {
                    napp.pusher(owner, message);
                }
            }
        })
    }

};

function cacheKey() {
    return Array.prototype.slice.call(arguments).join(':');
}