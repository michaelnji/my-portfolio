<template>
    <div class="flex-1 grid place-items-center text-center">
        <div>
            <div class="size-14 mx-auto text-warning grid place-items-center">
                <Icon name="ph:warning-fill" size="32" />
            </div>
            <h1 class="mt-4 text-3xl font-display font-semibold">Game not found</h1>
            <p class="mt-3 text-content-secondary font-normal-weight">
                This game is not available yet.
            </p>
            <NuxtLink to="/games" class="btn btn-primary mt-6">
                Return to dashboard
            </NuxtLink>
        </div>
    </div>
</template>
