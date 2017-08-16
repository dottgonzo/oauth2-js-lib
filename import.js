"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var oauth2login = require("./index");
window['loginapp'] = function (oauth2) {
    return new oauth2login.authComposer(oauth2);
};
