// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'g6rrl1f6d0'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-12vhdpr8.us.auth0.com',            // Auth0 domain
  clientId: process.env.CLIENT_ID,          // Auth0 client id
  callbackUrl: process.env.CALL_BACK_URL
}
