import * as cookie from 'cookie'
import * as jwt from 'jsonwebtoken'

import * as tokenControls from './_tokens'

export async function get( request ) {

    const cookies = cookie.parse( request.headers.cookie )

    const refreshToken = cookies.refresh_jwt

    try {
        var processedToken = await tokenControls.processRefreshToken( refreshToken )
    } catch(err) {
        return {
            status: 401,
            headers: {
                'set-cookie': [
                    'access_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
                    'refresh_jwt=deleted; path=/auth/refresh; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                ]
            },
            body: {
                message: "Invalid refresh token"
            }
        }
    }

    if ( processedToken.isValid ) {

        const newAccessToken = tokenControls.generateAccessToken( processedToken.data.username, processedToken.data.userId )

        return {
            status: 202,
            headers: {
                'set-cookie': `access_jwt=${newAccessToken}; Path=/; HttpOnly`
            },
            body: {
                message: 'New access token created'
            }
        }

    }

    return {
        status: 403,
        headers: {
            'set-cookie': [
                'access_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
                'refresh_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            ]
        },
        body: {
            message: 'Invalid refresh token'
        }
    }
    
}