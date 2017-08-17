import * as oauth2login from './index'

window['loginapp'] = function (serverUri: string, oauth2: oauth2login.IOauthClientConfig[]) {

    return new oauth2login.authComposer(serverUri, oauth2)

}