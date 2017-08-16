"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var oauth2login = require("./index");
var testOauth = {
    clientId: 'abc',
    accessTokenUri: 'https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: 'http://example.com/auth/github/callback',
    scopes: ['notifications', 'gist']
};
var login = new oauth2login.authComposer([testOauth]);
console.log(login.github.token.getUri());
