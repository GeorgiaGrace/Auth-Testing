import * as userControls from '$lib/users'
import * as tokenControls from './_tokens'

export async function post({ body }) {

    const { username, password } = body

    try {
        var newUser = await userControls.createNewUser( username, password )
    } catch(err) {
        return {
            status: 500,
            body: err
        }
    }

    const accessToken = tokenControls.generateAccessToken( username, newUser.id )
    const refreshToken = tokenControls.generateRefreshToken( newUser.id, newUser.username)

    return {
        status: 201,
        headers: {
            'set-cookie': [
                `access_jwt=${accessToken}; Path=/; HttpOnly`,
                `refresh_jwt=${refreshToken}; Path=/auth/refresh; HttpOnly`
            ]
        },
        body: {
            message: `Successfully created user: ${username}`,
            user: newUser
        }
    }

}