"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientOAuth2 = require("client-oauth2");
var authComposer = (function () {
    function authComposer(configurations) {
        var that = this;
        for (var i = 0; i < configurations.length; i++) {
            var oauthConfig = configurations[i];
            if (oauthConfig.accessTokenUri.indexOf('facebook') !== -1)
                that.facebook = new ClientOAuth2(oauthConfig);
            if (oauthConfig.accessTokenUri.indexOf('google') !== -1)
                that.google = new ClientOAuth2(oauthConfig);
            if (oauthConfig.accessTokenUri.indexOf('github') !== -1)
                that.github = new ClientOAuth2(oauthConfig);
            if (oauthConfig.accessTokenUri.indexOf('twitter') !== -1)
                that.twitter = new ClientOAuth2(oauthConfig);
        }
    }
    return authComposer;
}());
exports.authComposer = authComposer;
