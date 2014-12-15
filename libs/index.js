"use strict";

exports.init = function (napp) {
    var kettleState = require('./initializers/kettleState');
    kettleState.bind(napp)();
};
