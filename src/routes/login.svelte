<script lang='ts'>

    import { goto } from '$app/navigation'
    import { session } from '$app/stores'

    import { post } from '$lib/ultil'

    let username = ''
    let password = ''

    let errors = []

    async function login() {

        const response = await post('auth/login', { username, password })

        errors = response.errors || []

        if ( response.user ) {

            $session.user = response.user

            goto('/')

        }

    }

</script>

<h1>Login</h1>

<form on:submit|preventDefault={login}>
    <input type="text" placeholder="Username" bind:value={username}>
    <input type="password" placeholder="Password" bind:value={password}>
    <button>Login</button>
</form>

{#if errors.length} 

    {#each errors as err}
        <p>{err}</p>
    {/each}

{/if}