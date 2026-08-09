    <script lang="ts" setup>
    import powerDown from '../assets/sounds/power-down.mp3'
    import powerUp from '../assets/sounds/power-up.mp3'
    const playSounds = usePlaySound()
    const trackEvent = useTrackEvent()
    const { play } = useSound(powerUp, {
        volume: 0.7
    })
    const { play: play2 } = useSound(powerDown, {
        volume: 0.7
    })
    const toggleSound = () => {
        playSounds.value = !playSounds.value
        if (playSounds.value) play()
        else { play2() }
        trackEvent('sound_toggle', { enabled: playSounds.value })
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
