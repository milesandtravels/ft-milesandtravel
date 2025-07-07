<template>
  <div class="program-info-section mb-5">
    <div class="d-flex align-center">
      <v-avatar size="48" class="mr-4">
        <v-img :src="program.logo_url" :alt="program.name" cover>
          <template v-slot:error>
            <div class="logo-error-small">
              <v-icon icon="mdi-card-giftcard" size="20" color="grey"></v-icon>
            </div>
          </template>
        </v-img>
      </v-avatar>
      <div class="flex-grow-1">
        <h3 class="text-h6 font-weight-bold mb-1">
          {{ program.name }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Programa de {{ getProgramTypeName(program.type) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Program, ProgramType } from '~/interfaces/program'

  interface Props {
    program: Program
  }

  defineProps<Props>()

  const getProgramTypeName = (type: ProgramType): string => {
    const typeNames = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return typeNames[type] || type
  }
</script>

<style scoped>
  .logo-error-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(var(--v-theme-surface-variant), 0.3);
    border-radius: 50%;
  }

  .program-info-section {
    padding: 16px;
    background-color: rgba(var(--v-theme-surface-variant), 0.1);
    border-radius: 8px;
  }
</style>
