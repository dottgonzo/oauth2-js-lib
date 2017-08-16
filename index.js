"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientOAuth2 = require("client-oauth2");
var $ = require("jquery");
function triggerclick(el, url) {
    $('#' + el).on('click', function (e) {
        var height = 600;
        var width = 400;
        var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=" + width + ", height=" + height + ", top=" + (screen.height - 400) + ", left=" + (screen.width - 840));
        var HTMLstring = '<html>\n';
        HTMLstring += '<head>\n';
        HTMLstring += '<title>New Document</title>\n';
        HTMLstring += '</head>\n';
        HTMLstring += '<body>\n';
        HTMLstring += '<iframe frameborder="0" id="framelogin" width="100%" height="100%" style="height:100%;width:100%" src="' + url + '"></iframe>\n';
        HTMLstring += '</body>\n';
        HTMLstring += '</html>';
        win.document.write(HTMLstring);
        win.document.close();
    });
}
var authComposer = (function () {
    function authComposer(configurations) {
        this.authorized = false;
        this.token = false;
        this.onlogout = function () { console.log('logout'); };
        this.onlogin = function () { console.log('login'); };
        var that = this;
        if (configurations) {
            for (var i = 0; i < configurations.length; i++) {
                var oauthConfig = configurations[i];
                that.addAuth(oauthConfig);
            }
        }
        window['oauth2Callback'] = function (callback) {
            console.log('callbackfromauth');
            console.log(callback);
            if (callback && callback.data && callback.data.token) {
                console.log('authorized');
                that.setTokenImmediate(callback.data.token);
            }
            else {
                console.log('invalid message token');
            }
        };
        window.addEventListener("message", window['oauth2Callback'], false);
    }
    authComposer.prototype.setTokenImmediate = function (token) {
        this.token = token;
        this.authorized = true;
        window.localStorage.setItem('_tokenAppLocal', this.token);
        this.onlogin();
    };
    authComposer.prototype.logout = function () {
        this.token = false;
        this.authorized = false;
        window.localStorage.removeItem('_tokenAppLocal');
        this.onlogout();
    };
    authComposer.prototype.onLogin = function (fun) {
        this.onlogin = fun;
    };
    authComposer.prototype.onLogout = function (fun) {
        this.onlogout = fun;
    };
    authComposer.prototype.addAuth = function (oauthConfig) {
        var that = this;
        switch (oauthConfig.provider) {
            case 'facebook':
                that.facebook = new ClientOAuth2(oauthConfig);
                if (!oauthConfig.accessTokenUri)
                    oauthConfig.accessTokenUri = 'https://graph.facebook.com/v2.10/oauth/access_token';
                if (!oauthConfig.authorizationUri)
                    oauthConfig.authorizationUri = 'https://www.facebook.com/v2.10/dialog/oauth';
                break;
            case 'google':
                that.google = new ClientOAuth2(oauthConfig);
                if (!oauthConfig.accessTokenUri)
                    oauthConfig.accessTokenUri = 'https://www.googleapis.com/oauth2/v4/token';
                if (!oauthConfig.authorizationUri)
                    oauthConfig.authorizationUri = 'https://accounts.google.com/o/oauth2/v2/auth';
                break;
            case 'github':
                that.github = new ClientOAuth2(oauthConfig);
                if (!oauthConfig.accessTokenUri)
                    oauthConfig.accessTokenUri = 'https://github.com/login/oauth/access_token';
                if (!oauthConfig.authorizationUri)
                    oauthConfig.authorizationUri = 'https://github.com/login/oauth/authorize';
                break;
            case 'twitter':
                that.twitter = new ClientOAuth2(oauthConfig);
                if (!oauthConfig.accessTokenUri)
                    oauthConfig.accessTokenUri = 'https://api.twitter.com/oauth/request_token';
                if (!oauthConfig.authorizationUri)
                    oauthConfig.authorizationUri = 'https://api.twitter.com/oauth/authenticate';
                break;
            default:
                throw Error('no provider provided!');
        }
        if (oauthConfig.button_id)
            triggerclick(oauthConfig.button_id, that[oauthConfig.provider].token.getUri());
    };
    return authComposer;
}());
exports.authComposer = authComposer;
