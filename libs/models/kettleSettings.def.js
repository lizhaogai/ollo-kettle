"use strict";

var sec = require('sira-core').security;

module.exports = function (t) {
    return {
        properties: {
            id: {type: String},
            ownerId: { type: String, index: true},
            notify: { type: Boolean }
        }
    }
}