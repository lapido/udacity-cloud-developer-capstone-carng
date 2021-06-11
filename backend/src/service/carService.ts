import { APIGatewayProxyEvent } from "aws-lambda";
import * as uuid from 'uuid'
import { Car } from "../models/Car";
import { CarRepository } from "../repository/carRepository";
import { getUserId } from '../auth/utils'
import { CarSaleRequest } from "../requests/CarSaleRequest";
import * as AWS  from 'aws-sdk'
import { PaginatedCar } from "../models/PaginatedCar";
import { createLogger } from "../utils/logger";
import { BuyCarError } from "../error/BuyCarError";
import { CarNotFoundError } from "../error/CarNotFoundError";

const logger = createLogger('buyCar')
const carRepository = new CarRepository()
const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function createCar(event: APIGatewayProxyEvent, carSaleRequest: CarSaleRequest): Promise<Car> {
    const userId = getUserId(event)
    const carId = uuid.v4()

    const car: Car = {
        carId: carId,
        brand: carSaleRequest.brand,
        gearType: carSaleRequest.gearType,
        isBought: false,
        model: carSaleRequest.model,
        year: carSaleRequest.year,
        createdDate: new Date().toString(),
        amount: carSaleRequest.amount,
        sellerUserId: userId
    }

    return await carRepository.createCar(car)
}


export async function getCars(): Promise<Car[]> {
    return await carRepository.getCars()
}

export async function buyCar(carId: string,  event: APIGatewayProxyEvent): Promise<boolean> {
    const userId = getUserId(event)
    const car = await carRepository.getCarById(carId)

    if (userId == car.sellerUserId) {
        throw new BuyCarError('You cannot buy your own car')
    }

    if (!car) {
        throw new CarNotFoundError('Car does not exist')
    }
    logger.info('Car found ', {'car': car.carId})

    car.isBought = true
    car.dateBought = new Date().toString()
    car.boughtByUserId = userId
    if (!car.attachmentUrl) {
        car.attachmentUrl = null
    }

    return await carRepository.updateCar(car)
}

export async function generateUploadUrl(carId: string): Promise<string> {
    //const userId = getUserId(event)
    const car = await carRepository.getCarById(carId)

    if (!car) {
        throw new Error('Car does not exist')
    }

    const imageId = uuid.v4()
    const uploadUrl = getUploadUrl(imageId)

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    
    car.attachmentUrl = imageUrl
    if (!car.dateBought) car.dateBought = null
    if (!car.dateBought) car.dateBought = null
    if (!car.boughtByUserId) car.boughtByUserId = null

    await carRepository.updateCar(car)

    return uploadUrl
}

export async function getPaginatedCars(limit: any, nextKey: any): Promise<PaginatedCar> {
    return await carRepository.getPaginatedCars(limit, nextKey)
}


function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    })
  }