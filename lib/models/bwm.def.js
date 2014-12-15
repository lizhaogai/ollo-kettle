"use strict";

var sec = require('sira-core').security;

module.exports = function (t) {
    return {
        properties: {
            id: {type: String},
            ownerId: { type: String, index: true},
            rid: { type: String, index: true},
            data: { type: t.JSON }
        },
        acls: [
            {
                principalType: sec.ROLE,
                principalId: sec.EVERYONE,
                permission: sec.DENY
            },
            {
                principalType: sec.ROLE,
                principalId: sec.AUTHENTICATED,
                permission: sec.ALLOW,
                property: "findRules"
            }
            ,
            {
                principalType: sec.ROLE,
                principalId: sec.AUTHENTICATED,
                permission: sec.ALLOW,
                property: "findRule"
            },
            {
                principalType: sec.ROLE,
                principalId: sec.AUTHENTICATED,
                permission: sec.ALLOW,
                property: "deploy"
            },
            {
                principalType: sec.ROLE,
                principalId: sec.AUTHENTICATED,
                permission: sec.ALLOW,
                property: "update"
            },
            {
                principalType: sec.ROLE,
                principalId: sec.AUTHENTICATED,
                permission: sec.ALLOW,
                property: "remove"
            },
            {
                principalType: sec.ROLE,
                principalId: sec.AUTHENTICATED,
                permission: sec.ALLOW,
                property: "suspend"
            }
            ,
            {
                principalType: sec.ROLE,
                principalId: sec.AUTHENTICATED,
                permission: sec.ALLOW,
                property: "resume"
            }
        ]
    }
};
