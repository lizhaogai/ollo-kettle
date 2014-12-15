"use strict";

var ttl = 24 * 60 * 60; // last data cache ttl 24 hours

module.exports = function () {
    var napp = this;
    var log = napp.log.get('kettle:data');
    var dataBucket = napp.store.createBucket("kettle:data", {ttl: ttl}); // seconds

    // update last data on node:data
    napp.on('node:data', function (message) {
        var key = cacheKey(message.owner, message.guid);

        dataBucket.get(key, function (err, value) {
            if (err) {
                if (err) throw err;
            }

            dataBucket.set(key, message.data, function (err) {
                if (err) throw err;
            });

            if (message.data.D != 50004 || !value) {
                return;
            }

            var newValue = (typeof(message.data.DA) == 'string') ? JSON.parse(message.data.DA) : message.data.DA;
            var oldValue = (typeof(value.DA) == 'string') ? JSON.parse(value.DA) : value.DA;

            if (newValue.onoff == 'on') {
                if (oldValue.target != 0 && newValue.target == 0) {
                    notifyTarget(message.owner, oldValue.target);
                } else if (newValue.keepwarm) {
                    if (!newValue.boil && !newValue.heating && oldValue.heating) {
                        notifyKeepwarm(message.owner, newValue.target);
                    }
                } else if (!newValue.keepwarm && newValue.target == 0 && oldValue.boil && !newValue.boil) {
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
        napp.rekuest("kettleSettings.find")
            .prop("ownerId", owner)
            .send(function (err, result) {
                if (err) {
                    if (err) throw err;
                }

                if (result.data.notify) {
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