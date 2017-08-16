"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var oauth2login = require("./index");
var testOauth = {
    clientId: 'abc',
    redirectUri: 'http://example.com/auth/github/callback',
    scopes: ['notifications', 'gist'],
    provider: 'github'
};
var login = new oauth2login.authComposer([testOauth]);
console.log(login.github.token.getUri());
