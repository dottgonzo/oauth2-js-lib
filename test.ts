import * as oauth2login from './index'


const testOauth={
    clientId: 'abc',
    accessTokenUri: 'https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: 'http://example.com/auth/github/callback',
    scopes: ['notifications', 'gist']
}

const login=new oauth2login.authComposer([testOauth])

console.log(login.github.token.getUri())