<template>
  <div class="guidelines-section">
    <h4 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
      <v-icon class="mr-2" color="primary" size="20">
        mdi-clipboard-check-outline
      </v-icon>
      Por favor, atente-se às seguintes orientações:
    </h4>

    <ProgramConfirmationModalGuidelinesList :guidelines="guidelines" />

    <DisclaimerNote />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    guidelines: string[]
  }

  defineProps<Props>()
</script>
