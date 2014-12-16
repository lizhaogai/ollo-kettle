"use strict";

var support = require('./support');
var pusher = require('ollo-pusher');
var app = {
    get: function () {
        return {
            appKey: "54c3d3fa713a711958620e7d",
            appSecret: "ebb37741f5d662e6dab019b4"
        }
    }
};


//var napp = {
//    model: function () {
//        return {
//            all: function () {
//                var cb = arguments[arguments.length - 1];
//                cb(null, [
//                    {
//                        platform: "ios",
//                        type: "registration",
//                        value: "031a2810731"
//                    }
//                ])
//            }
//        }
//    }


describe('Jpush', function () {


    var h, user, node;

    var validCredentials = {name: 'lizhaogai', email: 'lizhaogai@qq.com', password: '111111'};
    var userpusher = { platform: "ios", type: "registration", value: "031a2810731"};
    var sampleNode = {nid: '1234567890AB'};
    var sampleData = [
        { "G": "0", "V": 0, "D": 50004, "DA": {temperature: 80}, "timestamp": Date.now() }
    ];

    beforeEach(support.setup());
    beforeEach(support.cleanup());
    beforeEach(support.setupUsers(validCredentials, function (_user) {
        user = _user;
    }));
    beforeEach(support.loginWith(validCredentials));
    beforeEach(support.setupUserpusher(userpusher));
    beforeEach(support.setupNode(sampleNode.nid, function (_node) {
        node = _node;
    }));

    beforeEach(function (done) {
        support.createHelper(function (helper) {
            h = helper;
            pusher.init(h.napp, app);
            done();
        });
    });

    afterEach(function (done) {
        h.cleanup(done);
    });

    describe('Kettle', function () {
        it('Heating to target without warm without boil', function (done) {
            var delay = h.delay(20);

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 60,
                        target: 80,
                        boil: 0,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 65,
                        target: 80,
                        boil: 0,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 67,
                        target: 80,
                        boil: 0,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 75,
                        target: 80,
                        boil: 0,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 79,
                        target: 80,
                        boil: 0,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 81,
                        target: 0,
                        boil: 0,
                        keepwarm: 0,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            h.delay(2000)(function () {
                done();
            });
        });

        it('Heating to target without warm and boil', function (done) {
            var delay = h.delay(20);

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 60,
                        target: 80,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 65,
                        target: 80,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 75,
                        target: 80,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 85,
                        target: 80,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 95,
                        target: 80,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 99,
                        target: 80,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 90,
                        target: 80,
                        boil: 0,
                        keepwarm: 0,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });


            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 84,
                        target: 80,
                        boil: 0,
                        keepwarm: 0,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });


            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 79,
                        target: 0,
                        boil: 0,
                        keepwarm: 0,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            h.delay(2000)(function () {
                done();
            });
        });

        it.only('Heating to target and warm', function (done) {
            var delay = h.delay(20);

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 60,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 65,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 67,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 75,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 79,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 81,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 78,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 81,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            h.delay(2000)(function () {
                done();
            });
        });


        it('Heating to target and warm and boil', function (done) {
            var delay = h.delay(20);

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 60,
                        target: 80,
                        boil: 1,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 65,
                        target: 80,
                        boil: 1,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 75,
                        target: 80,
                        boil: 1,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 85,
                        target: 80,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 95,
                        target: 80,
                        boil: 1,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 99,
                        target: 80,
                        boil: 1,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 90,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });


            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 84,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });


            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 79,
                        target: 0,
                        boil: 0,
                        keepwarm: 1,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 81,
                        target: 80,
                        boil: 0,
                        keepwarm: 1,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            h.delay(2000)(function () {
                done();
            });
        });


        it('Heating to boil', function (done) {
            var delay = h.delay(20);

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 60,
                        target: 0,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 65,
                        target: 0,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 75,
                        target: 0,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 85,
                        target: 0,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 95,
                        target: 0,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 99,
                        target: 0,
                        boil: 1,
                        keepwarm: 0,
                        heating: 1,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            delay(function () {
                h.data(node, {
                    D: 50004,
                    DA: {
                        temperature: 99,
                        target: 0,
                        boil: 0,
                        keepwarm: 0,
                        heating: 0,
                        present: 1,
                        onoff: 'on',
                        volume: 1000
                    }
                });
            });

            h.delay(2000)(function () {
                done();
            });
        });
    });
});