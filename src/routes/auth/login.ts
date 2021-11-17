import * as tokenControls from './_tokens'
import * as userControls from '$lib/users'

export async function post( { body } ) {

    const { username, password } = body

    const passwordCheck = await userControls.checkPassword( username, password )

    if ( passwordCheck.match ) {
        
        const accessToken = tokenControls.generateAccessToken( username, passwordCheck.id )
        const refreshToken = tokenControls.generateRefreshToken( passwordCheck.id, passwordCheck.username)

        return {
            status: 201,
            headers: {
                'set-cookie': [
                    `access_jwt=${accessToken}; Path=/; HttpOnly`,
                    `refresh_jwt=${refreshToken}; Path=/auth/refresh; HttpOnly`
                ]
            },
            body: {
                message: `Successfully logged in`,
                user: {
                    username,
                    id: passwordCheck.id
                }
            }
        }
 
    }

    return {
        status: 401,
        headers: {
            'set-cookie': [
                'access_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
                'refresh_jwt=deleted; path=/auth/refresh; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            ]
        },
        body: {
            message: 'Login failed'
        }
    }

}