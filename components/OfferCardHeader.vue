<template>
  <v-card-item class="pa-3">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar v-if="ecommerce.logo_url" size="32" class="me-2">
          <v-img :src="ecommerce.logo_url" :alt="ecommerce.name" />
        </v-avatar>
        <span class="text-body-2 font-weight-medium">
          {{ ecommerce.name }}
        </span>
      </div>

      <ProgramTypeChip :type="program.type" variant="flat" class="text-white" />
    </div>
  </v-card-item>
</template>

<script setup lang="ts">
  import type { Ecommerce } from '~/interfaces/ecommerces'
  import type { Program } from '~/interfaces/program'

  interface Props {
    ecommerce: Ecommerce
    program: Program
  }

  defineProps<Props>()
</script>
