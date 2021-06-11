import { APIGatewayProxyEvent, CustomAuthorizerEvent } from 'aws-lambda'
import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger'
import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
 const logger = createLogger('utils')

 export function getUserIdUsingCustomEvent(event: CustomAuthorizerEvent): string {
  const authorization = event.authorizationToken
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function parseUserId(jwtToken: string): string {
  logger.info("Attempt to get userID by token", jwtToken)
  logger.info(jwtToken)
  console.log(jwtToken)
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}
