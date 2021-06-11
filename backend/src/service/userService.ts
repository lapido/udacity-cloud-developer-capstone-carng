import { CustomAuthorizerEvent } from "aws-lambda";
import { User } from '../models/User';
import { UserRepository } from '../repository/userRepository';
import { getUserIdUsingCustomEvent as getUserId, parseUserId } from '../auth/utils'
import { createLogger } from "../utils/logger";
import fetch from "node-fetch";

const logger = createLogger('user')
const userRepository = new UserRepository()
const auth0ClientId = process.env.AUTH_0_CLIENT_ID
const auth0ClientSecret = process.env.AUTH_0_CLIENT_SECRET
const auth0Audience = process.env.AUTH_0_AUDIENCE
const auth0TokenUrl = process.env.AUTH_0_TOKEN_URL

export async function registerUser(event: CustomAuthorizerEvent): Promise<User> {
    const userId = getUserId(event)
    logger.info("Attempt to get user details from remote")
    const user = await getUserDetailsFromRemote(userId)
    user.joinedDate = new Date().toString()
    await userRepository.createUser(user)
    
    return user 
}

export async function getUserByUserId(token: string): Promise<User> {
    return await userRepository.getUserByUserId(parseUserId(token))
}

async function getUserDetailsFromRemote(userId: string): Promise<User> {
    try {
        const authToken = await getAuth0AdminToken()
        const url = `${auth0Audience}users/${userId}`
        const bearerAuth = `Bearer ${authToken}`
        logger.info(bearerAuth)
        logger.info(url)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': bearerAuth
            }
        })
        .then(res => res.json())
        .then(res => {
            logger.info("user profile ", res)
            const user: User = {
                userId: userId,
                email: res.email,
                username: res.nickname,
                name: res.name
            }
            return user
        })
        
    } catch (error) {
        logger.error("Error occured while getting auth0 token ", error)
        throw new Error('Error retrieving user details from Auth0');
    }
}

function getAuth0AdminToken(): Promise<string> {
    logger.info("Attempt to get Auth0 token")
    const requestData = {
        'grant_type': 'client_credentials',
        'client_id': auth0ClientId,
        'client_secret': auth0ClientSecret,
        'audience': auth0Audience
    }
    return fetch(auth0TokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
    })
    .then(res => res.json())
    .then(res => {
        logger.info("Getting Admin Token ", res)
        return res.access_token
    })
    .catch(e => {
        logger.error("Error occured while getting auth0 token ", e)
        throw new Error('Error occured retrieving token from Auth0');
    })
}