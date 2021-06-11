import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { buyCar } from '../../service/carService'
import { createLogger } from '../../utils/logger'
import { BuyCarError} from '../../error/BuyCarError'
import { CarNotFoundError } from '../../error/CarNotFoundError'

const logger = createLogger('buyCar')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
    logger.info('Processing event ', event)

    const carId = event.pathParameters.carId
    
    try {
        await buyCar(carId, event);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: "Congratulations! car bought"
            })
        }

    } catch (e) {
        logger.error('Error - ', {error: e.message})

        if (e instanceof CarNotFoundError) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({
                    message: "Car not found"
                })
            }
        }

        if (e instanceof BuyCarError) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({
                    message: "You can not buy your own car"
                })
            }
        }

    }

}