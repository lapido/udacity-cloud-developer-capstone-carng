import { Car } from './Car'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
export interface PaginatedCar{
    items: Car[],
    nextKey: DocumentClient.Key
}