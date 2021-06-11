import * as faker from 'faker'
import { CarSaleRequest } from '../../src/requests/CarSaleRequest'
import * as UserUtil from '../../src/auth/utils'
import { CarRepository } from '../../src/repository/carRepository'
import { createCar, getCars } from '../../src/service/carService'
import { Car } from '../../src/models/Car'

jest.mock('../../src/repository/carRepository')
afterEach(() => {
    jest.clearAllMocks()
})

test('should create a car', async () => {
    const carRequest: CarSaleRequest = {
        brand: faker.lorem.word(10),
        model: faker.lorem.word(10),
        gearType: faker.lorem.word(10),
        year: faker.lorem.word(4),
        amount: faker.datatype.number(10)
    }

    jest.spyOn(UserUtil, 'getUserId').mockReturnValue('19999')
    
    const car: Car = returnCar()
    CarRepository.prototype.createCar = jest.fn().mockImplementationOnce( () => car)

    const event: any = {}
    const result = await createCar(event, carRequest)
    expect(result).not.toBeNull()

})

test('should return a list of cars', async () => {
    const cars: any[] = [returnCar(), returnCar()]

    const mockGetCars = jest.fn()
    CarRepository.prototype.getCars = mockGetCars
    mockGetCars.mockReturnValue(Promise.resolve(cars))

    const result: any[] = await getCars()
    expect(result).not.toBeNull()
    console.log(result)
    expect(result.length).toBeGreaterThan(0)
})

function returnCar() {
    const car: Car = {
        brand: faker.lorem.word(10),
        model: faker.lorem.word(10),
        gearType: faker.lorem.word(10),
        year: faker.lorem.word(4),
        amount: faker.datatype.number(10),
        carId: faker.lorem.word(10),
        createdDate: '',
        isBought: false,
        sellerUserId: faker.lorem.word(10)

    }

    return car
}