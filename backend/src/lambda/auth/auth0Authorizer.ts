import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import { JwksClient } from 'jwks-rsa'
import { getUserByUserId, registerUser } from '../../service/userService'

const logger = createLogger('auth')

const jwksUrl = process.env.AUTH_0_JWKS_URI
const jwkKid = process.env.AUTH_0_KID

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    logger.info('Authorizing a user', event.authorizationToken)
    try {
      logger.info("Debugging - ", event)
      const token = getToken(event.authorizationToken)
      const jwtToken = await verifyToken(token)
      const user = await getUserByUserId(token)
      if (!user) {
        logger.info("Attempt to register user")
          await registerUser(event)
      }

      logger.info('User was authorized', jwtToken)
  
      return {
        principalId: jwtToken.sub,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: '*'
            }
          ]
        }
      }
    } catch (e) {
      logger.error('User not authorized', { error: e.message })
  
      return {
        principalId: 'user',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: '*'
            }
          ]
        }
      }
    }
  }

  async function verifyToken(token: string): Promise<JwtPayload> {
    const cert = await getSigningKey()
    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  }
  
  function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')
  
    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')
  
    const split = authHeader.split(' ')
    const token = split[1]
  
    return token
  }
  
  async function getSigningKey(): Promise<string> {
    const client = new JwksClient({jwksUri: jwksUrl})
    const key = await client.getSigningKey(jwkKid)
  
    return key.getPublicKey()
  }