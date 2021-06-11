export interface Car {
    carId: string,
    brand: string,
    model: string,
    gearType: string,
    year: string,
    isBought: boolean,
    amount: number,
    createdDate: string,
    dateBought?: string,
    sellerUserId: string,
    boughtByUserId?: string,
    attachmentUrl?: string
}