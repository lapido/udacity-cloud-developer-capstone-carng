import { apiEndpoint } from '../config'
import { CarSaleRequest } from '../types/CarSaleRequest';
import Axios from 'axios'
import { Car } from '../types/Car';
import { BuyCarError } from '../error/BuyCarError';

export async function getCars(idToken: string): Promise<Car[]> {
    console.log('Fetching Cars')
  
    const response = await Axios.get(`${apiEndpoint}/cars`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('Cars:', response.data)
    return response.data.items
}

export async function createCar(idToken: string, newCar: CarSaleRequest): Promise<Car> {
    const response = await Axios.post(`${apiEndpoint}/cars`,  JSON.stringify(newCar), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    })
    return response.data.item
}

export async function getUploadUrl(idToken: string, carId: string): Promise<string> {
    const response = await Axios.post(`${apiEndpoint}/cars/${carId}/attachment`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    })
    return response.data.uploadUrl
}

export async function buyCar(idToken: string, carId: string): Promise<string> {
    try {
      const response = await Axios.put(`${apiEndpoint}/cars/${carId}`, "", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    
      return response.data.item
    } catch (error) {
        throw new BuyCarError("You cannot buy your own car")
    }
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
    await Axios.put(uploadUrl, file)
}