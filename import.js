"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var oauth2login = require("./index");
window['loginapp'] = function (serverUri, oauth2) {
    return new oauth2login.authComposer(serverUri, oauth2);
};
