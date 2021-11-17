import * as jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

export interface RefreshtJwt {
    type: string;
    username: string;
    userId: string;
    refreshToken: string;
}

export function generateAccessToken ( username: string, userId: string ) {
    return jwt.sign( {
        type:'access',
        userId,
        username,
        refreshToken: uuid()
    }, import.meta.env.VITE_ACCESS_SECRET.toString(), { expiresIn: '5m'} )
}

// Replace with DB Solution
    let refreshTokens: { userId: string, token: string }[] = []

export function generateRefreshToken( userId: string, username: string ) {

    const refreshToken = uuid()

    // Replace with DB Logic
        refreshTokens.push({ token: refreshToken, userId })

    const refreshJwt = jwt.sign( {
        type:'refresh',
        userId,
        refreshToken,
        username
    }, import.meta.env.VITE_REFRESH_SECRET.toString(), { expiresIn: '15d'} )

    return refreshJwt

}

export async function processRefreshToken( refreshJwt: string ): Promise<{ isValid: boolean, token: string, data: { userId: string, username: string }}> {

    const { userId, refreshToken, username } = jwt.verify( refreshJwt, import.meta.env.VITE_REFRESH_SECRET ) as RefreshtJwt

    // Replace with DB Logic

        const tokenExists = refreshTokens.some( t => (t.token == refreshToken) && (t.userId == userId) )

    return {
        isValid: tokenExists,
        token: refreshToken,
        data: {
            userId,
            username
        }
    }

}

export async function removeRefreshToken( refreshJwt: string ) {

    
    const { refreshToken } = jwt.verify( refreshJwt, import.meta.env.VITE_REFRESH_SECRET ) as RefreshtJwt

    // Replace with DB Logic

        const tokenIndex = refreshTokens.findIndex( t => t.token === refreshToken )
        if (tokenIndex) refreshTokens = refreshTokens.splice( tokenIndex, 1 );

    return { tokenRemoved: true }

}