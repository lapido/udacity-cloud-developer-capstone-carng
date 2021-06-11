import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../models/User'


export class UserRepository {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly userTable = process.env.USERS_TABLE) {
    }

    async createUser(user: User): Promise<User> {
        await this.docClient.put({
            TableName: this.userTable,
            Item: user
        }).promise()

        return user
    }


    async getUserByUserId(userId: string): Promise<User> {
        const result = await this.docClient.get({
            TableName: this.userTable,
            Key: {
                'userId': userId
            }
        }).promise()

        return result.Item as User
    }
}


