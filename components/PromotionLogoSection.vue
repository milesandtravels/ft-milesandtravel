<template>
  <div class="logo-section">
    <div class="logo-container mb-2">
      <v-img
        :src="logoUrl"
        :alt="alt"
        contain
        height="80"
        max-width="120"
        class="logo-image"
      >
        <template v-slot:error>
          <div class="logo-error">
            <v-icon :icon="fallbackIcon" size="30" color="grey"></v-icon>
          </div>
        </template>
      </v-img>
    </div>
    <div class="text-center">
      <p class="text-caption text-medium-emphasis mb-0">{{ label }}</p>
      <p class="text-body-2 font-weight-medium logo-name">
        {{ name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    logoUrl: string
    name: string
    alt: string
    label: string
    fallbackIcon: string
  }

  defineProps<Props>()
</script>

<style scoped>
  .logo-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 45%;
  }

  .logo-container {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .logo-image {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }

  .logo-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .logo-name {
    font-size: 0.9rem;
    line-height: 1.3;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .logo-container {
      height: 60px;
      padding: 8px;
    }

    .logo-name {
      font-size: 0.8rem;
    }
  }

  /* Dark theme */
  .v-theme--dark .logo-container {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .logo-error {
    background: rgba(255, 255, 255, 0.05);
  }
</style>
