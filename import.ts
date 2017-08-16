import * as oauth2login from './index'

window['loginapp']=function(oauth2:oauth2login.IOauthClientConfig[]){

    return new oauth2login.authComposer(oauth2)

}