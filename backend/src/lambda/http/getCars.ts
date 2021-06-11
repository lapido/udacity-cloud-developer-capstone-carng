import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getPaginatedCars } from '../../service/carService'
import { PaginatedCar } from '../../models/PaginatedCar'

const logger = createLogger('getCars')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    let nextKey
    let limit

    try {
        nextKey = parseNextKeyParameter(event)
        limit = parseLimitParameter(event) || 20
    } catch (e) {
        console.log('Failed to parse query parameters: ', e.message)
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            error: 'Invalid parameters'
          })
        }
    }

    const result: PaginatedCar = await getPaginatedCars(limit, nextKey)
      // Return result
    return {
        statusCode: 200,
        headers: {
        'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
        items: result.items,
        // Encode the JSON object so a client can return it in a URL as is
        nextKey: encodeNextKey(result.nextKey)
        })
    }
}

function parseLimitParameter(event) {
    const limitStr = getQueryParameter(event, 'limit')
    if (!limitStr) {
      return undefined
    }
  
    const limit = parseInt(limitStr, 10)
    if (limit <= 0) {
      throw new Error('Limit should be positive')
    }
  
    return limit
  }

function parseNextKeyParameter(event) {
    const nextKeyStr = getQueryParameter(event, 'nextKey')
    if (!nextKeyStr) {
      return undefined
    }
  
    const uriDecoded = decodeURIComponent(nextKeyStr)
    return JSON.parse(uriDecoded)
  }

function getQueryParameter(event, name) {
    const queryParams = event.queryStringParameters
    if (!queryParams) {
      return undefined
    }
  
    return queryParams[name]
}

function encodeNextKey(lastEvaluatedKey) {
    if (!lastEvaluatedKey) {
      return null
    }
  
    return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
  }
  