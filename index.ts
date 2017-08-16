
import * as ClientOAuth2 from 'client-oauth2'
import * as $ from 'jquery'


export interface IOauthClientConfig {
    clientId: string
    accessTokenUri: string
    authorizationUri: string
    redirectUri: string
    scopes: string[]
    button_id?:string
}

export interface IOauth2Callback{

}

window['oauth2Callback'] = function(callback:IOauth2Callback){

}

function triggerclick(el,url){
    $(el).on('click',function(e){
        window.open(url)
        })
}


export class authComposer {
    facebook: ClientOAuth2
    google: ClientOAuth2
    twitter: ClientOAuth2
    github: ClientOAuth2

    constructor(configurations: IOauthClientConfig[]) {
        const that = this
        for (let i = 0; i < configurations.length; i++) {
            const oauthConfig = configurations[i]


            if (oauthConfig.accessTokenUri.indexOf('facebook') !== -1) {
                that.facebook = new ClientOAuth2(oauthConfig)
                if (oauthConfig.button_id) triggerclick(oauthConfig.button_id,that.facebook.token.getUri())
            }
            if (oauthConfig.accessTokenUri.indexOf('google') !== -1) {
                that.google = new ClientOAuth2(oauthConfig)
                if (oauthConfig.button_id) triggerclick(oauthConfig.button_id,that.google.token.getUri())
            }
            if (oauthConfig.accessTokenUri.indexOf('github') !== -1) {
                that.github = new ClientOAuth2(oauthConfig)
                if (oauthConfig.button_id) triggerclick(oauthConfig.button_id,that.github.token.getUri())
            }
            if (oauthConfig.accessTokenUri.indexOf('twitter') !== -1) {
                that.twitter = new ClientOAuth2(oauthConfig)
                if (oauthConfig.button_id) triggerclick(oauthConfig.button_id,that.twitter.token.getUri())
            }

        }

    }
}


