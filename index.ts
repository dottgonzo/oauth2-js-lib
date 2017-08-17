
import * as ClientOAuth2 from 'client-oauth2'
import * as $ from 'jquery'
import * as axios from 'axios'

export interface IUser {
  passport_id: string
  email: string
}
export interface IUserLogin {
  passport_id: string
  email: string
  token: string
}
export interface IOauthClientConfig {
  clientId: string
  accessTokenUri?: string
  authorizationUri?: string
  scopes?: string[]
  button_id?: string
  provider: string
  redirectUri?: string

}

export interface IOauth2Callback {
  data: {
    token: string
  }
}



function authorizeWindow(url) {

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

}


function triggerclick(el, url) {
  $('#' + el).on('click', function (e) {
    authorizeWindow(url)
  })
}


export class authComposer {
  serverUri: string
  facebook: ClientOAuth2
  google: ClientOAuth2
  twitter: ClientOAuth2
  github: ClientOAuth2
  profile: IUser | false = false
  authorized: boolean = false
  token: string | false = false
  onlogout: Function = function () { console.log('logout') }
  onlogin: Function = function () { console.log('login') }
  constructor(serverUri: string, configurations?: IOauthClientConfig[]) {
    if (serverUri) {
      this.serverUri = serverUri
    } else {
      throw Error('No server uri provided')
    }
    const that = this
    if (configurations) {
      for (let i = 0; i < configurations.length; i++) {
        const oauthConfig = configurations[i]
        that.addAuth(oauthConfig)
      }
    }

const oauthf='oAuth2cb_'+Date.now()

    window[oauthf] = function (callback: IOauth2Callback | any) {
      console.log('callbackfromauth')
      console.log(callback)
      if (callback && callback.data && callback.data.token) {
        console.log('authorized')
        that.setUser(callback.data)
      } else {
        console.log('invalid message token')
      }
    }

    window.addEventListener('message', window[oauthf], false);

  }

  setUser(user: IUserLogin) {
    this.token = user.token
    this.authorized = true
    this.profile = {
      email: user.email,
      passport_id: user.passport_id
    }

    window.localStorage.setItem('_tokenAppLocal', this.token)
    window.localStorage.setItem('_userAppLocal', JSON.stringify(this.profile))
    
    this.onlogin({token:this.token,profile:this.profile})
  }

  logout() {
    this.token = false
    this.authorized = false
    this.profile=false

    window.localStorage.removeItem('_tokenAppLocal')
    window.localStorage.removeItem('_userAppLocal')
    
    this.onlogout()
  }

  local(user: string, passw: string) {
    const that = this

    const send_data = {
      user: user,
      password: passw
    }

    axios.post(that.serverUri + '', send_data).then((a) => {
      console.log(a)
    }).catch((err) => {
      console.log(err)
    })
  }
  loginWithToken(token: string) {
    const that = this
      if (!token) {
        console.log("no user and passw provided")
      } else {
        axios.post(that.serverUri + '/auth/token', { token: token }).then((a: any) => {
          console.log(a)
          that.setUser(a.data)
        })
      }

  }

  authorize(provider) {
    authorizeWindow(this[provider].token.getUri())
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

        if (!oauthConfig.scopes) oauthConfig.scopes = ['emails']
          

        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://graph.facebook.com/v2.10/oauth/access_token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://www.facebook.com/v2.10/dialog/oauth'
        oauthConfig.redirectUri = that.serverUri + '/auth/facebook/callback'
        break

      case 'google':
        that.google = new ClientOAuth2(oauthConfig)

        if (!oauthConfig.scopes) oauthConfig.scopes = ['https://www.googleapis.com/auth/userinfo.email']

        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://www.googleapis.com/oauth2/v4/token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://accounts.google.com/o/oauth2/v2/auth'
        oauthConfig.redirectUri = that.serverUri + '/auth/google/callback'

        break

      case 'github':
        that.github = new ClientOAuth2(oauthConfig)

        // TODO: mancano scopes

        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://github.com/login/oauth/access_token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://github.com/login/oauth/authorize'
        oauthConfig.redirectUri = that.serverUri + '/auth/github/callback'

        break


      case 'twitter':
        that.twitter = new ClientOAuth2(oauthConfig)

        // TODO: mancano scopes


        if (!oauthConfig.accessTokenUri) oauthConfig.accessTokenUri = 'https://api.twitter.com/oauth/request_token'
        if (!oauthConfig.authorizationUri) oauthConfig.authorizationUri = 'https://api.twitter.com/oauth/authenticate'
        oauthConfig.redirectUri = that.serverUri + '/auth/twitter/callback'

        break
      default:
        throw Error('no provider provided!')
    }

    if (oauthConfig.button_id) triggerclick(oauthConfig.button_id, that[oauthConfig.provider].token.getUri())



  }

}


