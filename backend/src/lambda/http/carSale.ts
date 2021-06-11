import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { CarSaleRequest } from '../../requests/CarSaleRequest'
import { createCar } from '../../service/carService'

const logger = createLogger('carSale')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
    logger.info('Processing car sale event: ', event)
    const carSaleRequest: CarSaleRequest = JSON.parse(event.body)

    const createdCar = await createCar(event, carSaleRequest)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: createdCar
        })
    }
}
