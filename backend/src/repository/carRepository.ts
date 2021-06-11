import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Car } from '../models/Car'
import { PaginatedCar } from '../models/PaginatedCar'
import { createLogger } from '../utils/logger'
const logger = createLogger('buyCar')

export class CarRepository {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly carTable = process.env.CARS_TABLE,
        private readonly gCarIndex = process.env.G_INDEX_NAME) {
    }

    async createCar(car: Car): Promise<Car> {
        await this.docClient.put({
            TableName: this.carTable,
            Item: car
        }).promise()

        return car
    }

    async getCarById(carId: string): Promise<Car> {
        const result = await this.docClient.query({
            TableName: this.carTable,
            IndexName: this.gCarIndex,
            KeyConditionExpression: 'carId = :carId',
            ExpressionAttributeValues: {
                ':carId': carId
            },
        }).promise()
        logger.info(result.Items)
        return result.Items[0] as Car
    }


    async getCars(): Promise<Car[]> {
        const result = await this.docClient.scan({
            TableName: this.carTable
        }).promise()

        return result.Items as Car[]
    }
    
    async getPaginatedCars(limit: any, nextKey: any): Promise<PaginatedCar> {
        const result = await this.docClient.scan({
            TableName: this.carTable,
            Limit: limit,
            ExclusiveStartKey: nextKey
        }).promise()

        const data: PaginatedCar = {
            items: result.Items as Car[],
            nextKey: result.LastEvaluatedKey
        }

        return data
    }

    async updateCar(car: Car): Promise<boolean> {
        await this.docClient.update({
            TableName: this.carTable,
            Key: {
                'sellerUserId': car.sellerUserId,
                'carId': car.carId
            },
            ExpressionAttributeValues: {
                ':isBought': car.isBought,
                ':dateBought': car.dateBought,
                ':boughtByUserId': car.boughtByUserId,
                ':attachmentUrl': car.attachmentUrl,
                ':carId': car.carId
            },
            ConditionExpression: 'carId = :carId',
            UpdateExpression: 'SET isBought = :isBought, dateBought = :dateBought, boughtByUserId = :boughtByUserId, attachmentUrl = :attachmentUrl',
            ReturnValues: 'UPDATED_NEW'
        }).promise()

        return true
    }
}


