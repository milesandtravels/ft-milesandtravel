<template>
  <div>
    <button @click="trackButtonClick">Clique para rastrear evento</button>
  </div>
</template>

<script lang="ts" setup>
  const { trackEvent } = useGtag()

  const trackButtonClick = () => {
    trackEvent('button_click', {
      event_category: 'engagement',
      event_label: 'example_button',
    })
  }
</script>
