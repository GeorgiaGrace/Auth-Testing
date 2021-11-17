import * as cookie from 'cookie'

import * as tokenControls from './_tokens'

export async function post( request ) {

    const refreshJwt = request.body.refreshJwt

    try {
        const processedToken = await tokenControls.processRefreshToken( refreshJwt )
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

    await tokenControls.removeRefreshToken( refreshJwt )

    return {
        status: 200,
        headers: {
            'set-cookie': [
                'access_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
                'refresh_jwt=deleted; path=/auth/refresh; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            ]
        },
        body: {
            message: 'Logged out'
        }
    }

}