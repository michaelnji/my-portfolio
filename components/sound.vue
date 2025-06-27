    <script lang="ts" setup>
    import powerUp from '../assets/sounds/power-up.mp3'
    import powerDown from '../assets/sounds/power-down.mp3'
    const playSounds = usePlaySound()
    const { play } = useSound(powerUp)
    const { play: play2 } = useSound(powerDown)
    const toggleSound = () => {
        playSounds.value = !playSounds.value
        if (playSounds.value) play()
        else { play2() }
    }
</script>
<template>
    <div>
        <button @click="toggleSound" class="cursor-pointer">
            <Icon name="ph:speaker-high-fill" size="19" v-if="playSounds" />
            <Icon name="ph:speaker-slash-fill" size="19" v-if="!playSounds" />
        </button>
    </div>
</template>
