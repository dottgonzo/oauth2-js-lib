
import * as ClientOAuth2 from 'client-oauth2'
import * as $ from 'jquery'
import * as axios from 'axios'


export interface IOauthClientConfig {
  clientId: string
  accessTokenUri?: string
  authorizationUri?: string
  redirectUri: string
  scopes?: string[]
  button_id?: string
  provider: string
  user_button?: string
  password_button?: string
}

export interface IOauth2Callback {
  data: {
    token: string
  }
}


function triggerclick(el, url) {
  $('#' + el).on('click', function (e) {

    // height width

    const height = 600
    const width = 400

    const win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=" + width + ", height=" + height + ", top=" + (screen.height - 400) + ", left=" + (screen.width - 840))





    let HTMLstring = '<html>\n';
    HTMLstring += '<head>\n';
    HTMLstring += '<title>New Document</title>\n';
    HTMLstring += '</head>\n';
    HTMLstring += '<body>\n';
    HTMLstring += '<iframe frameborder="0" id="framelogin" width="100%" height="100%" style="height:100%;width:100%" src="' + url + '"></iframe>\n';
    HTMLstring += '</body>\n';
    HTMLstring += '</html>';

    win.document.write(HTMLstring)

    win.document.close()

  })
}


export class authComposer {
  facebook: ClientOAuth2
  google: ClientOAuth2
  twitter: ClientOAuth2
  github: ClientOAuth2
  localOptions: IOauthClientConfig | false = false
  authorized: boolean = false
  token: string | false = false
  onlogout: Function = function () { console.log('logout') }
  onlogin: Function = function () { console.log('login') }
  constructor(configurations?: IOauthClientConfig[]) {
    const that = this
    if (configurations) {
      for (let i = 0; i < configurations.length; i++) {
        const oauthConfig = configurations[i]
        that.addAuth(oauthConfig)
      }
    }



    window['oauth2Callback'] = function (callback: IOauth2Callback | any) {
      console.log('callbackfromauth')
      console.log(callback)
      if (callback && callback.data && callback.data.token) {
        console.log('authorized')
        that.setTokenImmediate(callback.data.token)
      } else {
        console.log('invalid message token')
      }
    }

    window.addEventListener("message", window['oauth2Callback'], false);

  }

  setTokenImmediate(token: string) {
    this.token = token
    this.authorized = true
    window.localStorage.setItem('_tokenAppLocal', this.token)
    this.onlogin()
  }

  logout() {
    this.token = false
    this.authorized = false
    window.localStorage.removeItem('_tokenAppLocal')
    this.onlogout()
  }

  local(user: string, passw: string, uri?: string) {
    if (user && passw) {
      if (uri) {

      } else if (this.localOptions && this.localOptions.authorizationUri) {
        uri = this.localOptions.authorizationUri
      } else {
        throw Error("few params");
      }
    } else {
      throw Error("no user and passw provided");
    }

    const send_data = {
      user: user,
      password: passw
    }

    axios.post(uri, send_data).then((a) => {
      console.log(a)
    }).catch((err) => {
      console.log(err)
    })
  }
  onLogin(fun) {
    this.onlogin = fun
  }
  onLogout(fun) {
    this.onlogout = fun
  }
  addAuth(oauthConfig: IOauthClientConfig) {
    const that = this
    switch (oauthConfig.provider) {

      case 'facebook':
        that.facebook = new ClientOAuth2(oauthConfig)

        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://graph.facebook.com/v2.10/oauth/access_token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://www.facebook.com/v2.10/dialog/oauth'
        break

      case 'google':
        that.google = new ClientOAuth2(oauthConfig)


        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://www.googleapis.com/oauth2/v4/token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://accounts.google.com/o/oauth2/v2/auth'
        break

      case 'github':
        that.github = new ClientOAuth2(oauthConfig)


        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://github.com/login/oauth/access_token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://github.com/login/oauth/authorize'
        break


      case 'twitter':
        that.twitter = new ClientOAuth2(oauthConfig)

        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://api.twitter.com/oauth/request_token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://api.twitter.com/oauth/authenticate'
        break
      case 'local':
        if (oauthConfig.authorizationUri) {
          that.localOptions = oauthConfig
        } else {
          throw Error('no authorization uri provided')
        }
        break
      default:
        throw Error('no provider provided!')

    }
    if (oauthConfig.button_id && oauthConfig.provider !== 'local') {
      triggerclick(oauthConfig.button_id, that[oauthConfig.provider].token.getUri())
    }



  }

}


