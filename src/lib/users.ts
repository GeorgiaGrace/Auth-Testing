import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import passwordValidator from 'password-validator'

var schema = new passwordValidator()

schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()

// Temp until DB implemented
    let users: {
        id: string,
        username: string,
        hashedPassword: string
    }[] = [
        {
            id: uuid(),
            username: 'user',
            hashedPassword: bcrypt.hashSync('password', parseInt(import.meta.env.VITE_SALT_ROUNDS) )
        }
    ]

export async function getUser( id: string ): Promise<{ id: string, username: string, hashedPassword: string} > {

    // Replace with DB logic
        const user = users.find( u => u.id == id )
    
    return {id: user.id, username: user.username, hashedPassword: user.hashedPassword}
}

export async function getUserByUsername( username: string ): Promise<{ id: string, username: string, hashedPassword: string} > {

    // Replace with DB logic
        const user = users.find( u => u.username == username )
    
    return {id: user.id, username: user.username, hashedPassword: user.hashedPassword}
}

export async function checkUsernameExists( username: string ): Promise<boolean> {

    // Replace with DB logic
        const userExists = users.some( u => u.username === username )
    
    return userExists

}

export async function createNewUser ( username:string, password:string ): Promise<{username: string, id: string}> {

    // Validate Password

        const passwordValidation = schema.validate(password , {details: true} ) as any[]

        console.log(passwordValidation)

        if ( passwordValidation.length ) {

            const issues = passwordValidation.map( i => i.message )

            throw {
                message: 'Password does not meet requirements',
                issues: issues
            }
        }

    // Confirm Unique Username
        const usernameNotUnique = await checkUsernameExists(username)

        if ( usernameNotUnique ) {
            throw {
                message: 'Username already used',
                issues: ['Username already used']
            }
        }


    const hashedPassword = bcrypt.hashSync( password, parseInt(import.meta.env.VITE_SALT_ROUNDS) )

    const userId = uuid()

    // Replace with DB logic
        users.push({
            username,
            hashedPassword,
            id: userId
        })

    return { username, id: userId }

}

export async function checkPassword( username: string, password: string ): Promise<{ username: string, id: string, match: boolean }> {

    // Replace with DB logic
        const user = users.find( u => u.username == username )

    if (user) {

        const passwordsMatch = await bcrypt.compare( password, user.hashedPassword )

        if (passwordsMatch) { return { username, id: user.id, match: true} } 

    }

    return {
        username: null,
        id: null,
        match: false
    }

}