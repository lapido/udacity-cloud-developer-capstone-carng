# Serverless CARNG

This is a serverless application with several lambda functions dedicated to performing a dedicated operation.

# Functionality of the application

This application will allow you put your car for sale and also buy cars from other users. It is a platform created for users who want to shop for used or new cars, and also who want to sell their cars.

# CAR items

The application should store CAR items, and each CAR item contains the following fields:

* `carId` (string) - a unique id for an item
* `brand` (string) - the brand of the car item
* `model` (string) - the model fo the car item
* `gearType` (string) - the gearType for the car item
* `year` (string) - the year car was made
* `isBought` (boolean) - true if the car item has been sold, false otherwise
* `amount` (number) - the amount of the car
* `createdDate` (string) - date and time when the car item was created
* `dateBought` (string) - date and time when the car was sold
* `sellerUserId` (string) - the uniqueId of the seller
* `boughtByUserId` (string) (optional) - the uniqueId of the user who bought the car
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to the car item


# Functions to be implemented

The project has the following functions configured in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions. The Auth also calls the Authorization server to get the user profile that contains the details of the user for registration.

* `GetCars` - should return all Cars both sold and available.

It should return data that looks like this:

```json
{
    "items": [
        {
            "model": "lorem Ipsum",
            "createdDate": "Fri Jun 04 2021 23:34:48 GMT+0000 (Coordinated Universal Time)",
            "sellerUserId": "google-oauth2|106512445858872239293",
            "attachmentUrl": "https://serverless-todo-images-dev.s3.amazonaws.com/810e6d47-0a1e-42b3-a222-e5216288323b",
            "boughtByUserId": "google-oauth2|106512445858872239293",
            "year": "2019",
            "amount": 9000,
            "brand": "lorem Ipsum",
            "dateBought": "Sat Jun 05 2021 00:09:14 GMT+0000 (Coordinated Universal Time)",
            "isBought": true,
            "carId": "247b055e-5a03-4655-9bff-7677aebd3768",
            "gearType": "loremIpsum"
        },
        {
            "model": "Rio Ipsum",
            "createdDate": "Sat Jun 05 2021 20:00:24 GMT+0000 (Coordinated Universal Time)",
            "sellerUserId": "google-oauth2|106512445858872239293",
            "attachmentUrl": "https://serverless-todo-images-dev.s3.amazonaws.com/6dc7cc1d-b35a-41f1-a47b-147d23e3d136",
            "boughtByUserId": "google-oauth2|113097493400758711750",
            "year": "2016",
            "amount": 1999,
            "brand": "Kia Ipsum",
            "dateBought": "Sat Jun 05 2021 20:30:14 GMT+0000 (Coordinated Universal Time)",
            "isBought": true,
            "carId": "2f205311-1aaf-41f0-b289-0ca57011ae41",
            "gearType": "loremIpsum"
        },
        {
            "model": "Rio Ipsum",
            "createdDate": "Sat Jun 05 2021 14:55:14 GMT+0000 (Coordinated Universal Time)",
            "sellerUserId": "google-oauth2|106512445858872239293",
            "attachmentUrl": "https://serverless-todo-images-dev.s3.amazonaws.com/c65c3ac8-ca21-4675-9c91-f67e06a37038",
            "boughtByUserId": "google-oauth2|113097493400758711750",
            "year": "2016",
            "amount": 1999,
            "brand": "Kia Ipsum",
            "dateBought": "Sat Jun 05 2021 20:36:11 GMT+0000 (Coordinated Universal Time)",
            "isBought": true,
            "carId": "cab89311-e11f-43b2-ab69-1cb943164aad",
            "gearType": "loremIpsum"
        },
        {
            "model": "Rio lorem",
            "createdDate": "Sat Jun 05 2021 22:56:17 GMT+0000 (Coordinated Universal Time)",
            "sellerUserId": "google-oauth2|113097493400758711750",
            "attachmentUrl": "https://serverless-todo-images-dev.s3.amazonaws.com/ead1b896-2639-41d8-952f-b46ddab1a063",
            "boughtByUserId": null,
            "year": "1999",
            "amount": 9000,
            "brand": "Kia lorem",
            "dateBought": null,
            "isBought": false,
            "carId": "3df25b74-575a-4b7f-a3b3-6dbc14340269",
            "gearType": "lorem Ipsum"
        }
}
```

* `BuyCar` - this function processes a car to be sold. should return an empty response

* `CarSale` - this function stores a car submitted to be sold

It receives a new CAR item to be created in JSON format that looks like this:

```json
{
    "brand": "Kia Ipsum",
    "model": "Rio Ipsum",
    "gearType": "loremIpsum",
    "year": "2016",
    "amount": 1999
}
```

It should return a new CAR item that looks like this:

```json
{
    "item": {
        "carId": "7654432c-6cd7-4b60-862c-240df4c1b872",
        "brand": "Kia Ipsum",
        "gearType": "loremIpsum",
        "isBought": false,
        "model": "Rio Ipsum",
        "year": "2016",
        "createdDate": "Fri Jun 11 2021 14:22:25 GMT+0000 (Coordinated Universal Time)",
        "amount": 1999,
        "sellerUserId": "google-oauth2|113097493400758711750"
    }
}
```

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a TODO item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.


## Authentication

The application uses Auth0 as the authentication provider.


# How to run the application

## Backend

To deploy the application run the following commands:

```
cd backend
npm install
sls deploy -v
```

# Postman collection
https://www.getpostman.com/collections/03ac646eedca67557666