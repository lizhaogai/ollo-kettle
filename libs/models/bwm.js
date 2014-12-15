"use strict";

var uuid = require('node-uuid');

var _ = require('lodash');
module.exports = function (Bwm, napp) {
    if (!napp) {
        return;
    }

    function transform(bwm) {
        var _bwm = _.pick(bwm, ['rid', 'ownerId']);
        _bwm.rid = bwm.id;
        _.defaults(_bwm, _.pick(bwm.data, ['suspended', 'name', 'timeout', 'shortName', 'preconditions', 'actions']));
        return _bwm;
    }

    Bwm.findRules = function (uid, cb) {
        Bwm.all({where: {ownerId: uid}}, function (err, bwms) {
            if (err) return cb(err);

            var _bwms = [];
            _.forEach(bwms, function (bwm) {
                var _bwm = transform(bwm);
                _bwms.push(_bwm)
            });
            return cb(null, _bwms);
        });
    };

    Bwm.findRule = function (uid, rid, cb) {
        Bwm.find(rid, function (err, bwm) {
            if (err) return cb(err);
            var _bwm = transform(bwm);
            return cb(null, _bwm);
        });
    };

    Bwm.deploy = function (uid, data, cb) {
        napp.rules.deploy(uid, data, function (err, rule) {
            if (err) {
                return cb(err)
            }

            Bwm.create({ownerId: uid, data: data, rid: rule.id}, function (err, bwm) {
                if (err) {
                    return cb(err)
                }
                return cb(null, {rid: bwm.id});
            });
        });
    };

    Bwm.update = function (uid, id, data, cb) {
        Bwm.find(id, function (err, bwm) {
            if (err) return cb(err);
            bwm.updateAttributes({data: data}, function (err, bwm) {
                if (err) return cb(err);
                napp.rules.updateRule({owner: uid, id: bwm.rid}, data, function (err) {
                    if (err) return cb(err);
                    return cb(null);
                });
            });
        });
    };

    Bwm.remove = function (uid, id, cb) {
        Bwm.find(id, function (err, bwm) {
            if (err) return cb(err);
            napp.rules.deleteRule({owner: uid, id: bwm.rid}, function (err) {
                if (err) return cb(err);
                return bwm.destroy(cb);
            });
        });
    };

    Bwm.suspend = function (uid, rid, cb) {
        Bwm.find(rid, function (err, bwm) {
            if (err) return cb(err);
            var data = bwm.data || {};
            data.suspended = true;
            bwm.updateAttributes(data, function (err) {
                if (err) return cb(err);
                napp.rules.suspendRule({owner: uid, id: bwm.rid}, function (err) {
                    if (err) return cb(err);
                    return cb(null);
                });
            });
        });
    };

    Bwm.resume = function (uid, rid, cb) {
        Bwm.find(rid, function (err, bwm) {
            if (err) return cb(err);
            var data = bwm.data || {};
            data.suspended = false;
            bwm.updateAttributes(data, function (err) {
                if (err) return cb(err);
                napp.rules.activeRule({owner: uid, id: bwm.rid}, function (err) {
                    if (err) return cb(err);
                    return cb(null);
                });
            });
        });
    };

    Bwm.boil = function (uid, guid, cb) {

    };

    Bwm.warm = function (uid, guid, data, cb) {

    };

    Bwm.expose('findRules', {
        description: "Fetch all the rules paired to an account.",
        accepts: [
            {name: 'uid', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }}
        ],
        returns: { name: 'rules', type: 'object', root: true },
        http: {verb: 'get', path: '/'}
    });

    Bwm.expose('findRule', {
        accepts: [
            {name: 'uid', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }},
            {name: 'rid', type: 'string'}
        ],
        returns: { name: 'rule', type: 'object', root: true },
        http: {verb: 'get', path: '/:rid'}
    });

    Bwm.expose('deploy', {
        accepts: [
            {name: 'uid', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }},
            {name: 'data', type: 'object', source: 'body'}
        ],
        returns: { name: 'rules', type: 'object', root: true },
        http: {verb: 'post', path: '/'}
    });

    Bwm.expose('update', {
        accepts: [
            {name: 'uid', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }},
            {name: 'id', type: 'string'},
            {name: 'data', type: 'object', source: 'body'}
        ],
        returns: { name: 'rules', type: 'object', root: true },
        http: {verb: 'put', path: '/:id'}
    });

    Bwm.expose('remove', {
        accepts: [
            {name: 'uid', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }},
            {name: 'id', type: 'string'}
        ],
        returns: { name: 'rules', type: 'object', root: true },
        http: {verb: 'del', path: '/:id'}
    });

    Bwm.expose('suspend', {
        accepts: [
            {name: 'uid', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }},
            {name: 'id', type: 'string'}
        ],
        returns: { name: 'result', type: 'object', root: true },
        http: {verb: 'post', path: '/:id/suspend'}
    });

    Bwm.expose('resume', {
        accepts: [
            {name: 'uid', type: 'string', source: function (ctx) {
                return (ctx.req.user && ctx.req.user.family) || (ctx.req.accessToken && ctx.req.accessToken.userId);
            }},
            {name: 'id', type: 'string'}
        ],
        returns: { name: 'result', type: 'object', root: true },
        http: {verb: 'del', path: '/:id/suspend'}
    });

};