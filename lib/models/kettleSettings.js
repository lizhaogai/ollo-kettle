"use strict";


//TODO 在web下 Model的位置目前只有在app目录下才可被加载，目前放在该目录下实现功能，确认后调整位置
var _ = require('lodash');
var vds = require('nino/lib/vendor-devices');
var events = require('nino/lib/events');

module.exports = function (KettleSettings, napp) {
    //TODO 解决compound 加载会出的错，models 应该在其他目录，调整后可以删除该判断
    if (!napp) {
        return;
    }

    var Device = napp.model("Device");

    KettleSettings.validatesPresenceOf('ownerId');

    KettleSettings.updateNotify = function (ownerId, notify, cb) {
        KettleSettings.findOne({where: {ownerId: ownerId}}, function (err, kettleSetting) {
            if (err) {
                return cb(err)
            }
            if (kettleSetting) {
                kettleSetting.updateAttributes({notify: notify}, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    return cb();
                });
            } else {
                KettleSettings.create({onwerId: ownerId, notify: notify}, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    return cb();
                });
            }
        });
    };

    KettleSettings.get = function (ownerId, cb) {
        KettleSettings.findOne({where: {ownerId: ownerId}}, function (err, kettleSetting) {
            if (err) {
                return cb(err);
            }
            if (!kettleSetting) {
                KettleSettings.create({onwerId: ownerId, notify: true}, function (err, _kettleSetting) {
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, _kettleSetting);
                });
            } else {
                return cb(null, kettleSetting);
            }
        });
    };

    KettleSettings.expose('updateNotify', {
        accepts: [
            {name: 'ownerId', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }},
            {name: 'notify', type: 'string'}
        ],
        returns: { name: 'result', type: 'object', root: true },
        http: {verb: 'put', path: '/'}
    });

    KettleSettings.expose('get', {
        accepts: [
            {name: 'ownerId', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }}
        ],
        returns: { name: 'result', type: 'object', root: true },
        http: {verb: 'get', path: '/'}
    });
};