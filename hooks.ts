/** @type {import('@sveltejs/kit').Handle} */

export async function handle ({request, resolve}) {

    const response = await resolve(request);

    return {
        ...response,
        headers: {
            ...response.headers
        }
    }
}