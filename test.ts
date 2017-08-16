import * as oauth2login from './index'


const testOauth={
    clientId: 'abc',
    redirectUri: 'http://example.com/auth/github/callback',
    scopes: ['notifications', 'gist'],
    provider:'github'
}

const login=new oauth2login.authComposer([testOauth])

console.log(login.github.token.getUri())