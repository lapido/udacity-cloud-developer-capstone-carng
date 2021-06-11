import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../service/carService'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', event)

    const carId = event.pathParameters.carId

    try {
        const uploadUrl = await generateUploadUrl(carId)

        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              uploadUrl: uploadUrl
            })
          }
    } catch (e) {
        logger.error('Error occured - ', {'error': e})

        return {
            statusCode: 404,
            body: JSON.stringify({
              error: 'Car does not exist'
            })
          }
    }

}