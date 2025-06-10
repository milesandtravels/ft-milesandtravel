<template>
  <div class="mb-4">
    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
      Marketplaces
    </label>
    <v-select
      v-model="selectedMarketplaces"
      chips
      closable-chips
      :items="marketplaceOptions"
      multiple
      placeholder="Selecione os marketplaces..."
      prepend-inner-icon="mdi-store-outline"
      variant="outlined"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props">
          <template #prepend>
            <v-avatar
              class="mr-3"
              :color="item.raw.color"
              size="32"
            >
              <v-icon color="white" size="18">{{ item.raw.icon }}</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
        </v-list-item>
      </template>

      <template #chip="{ props, item }">
        <v-chip
          v-bind="props"
          class="text-white marketplace-chip"
          :color="item.raw.color"
          size="small"
          variant="flat"
        >
          <v-icon left size="16">{{ item.raw.icon }}</v-icon>
          {{ item.raw.name }}
        </v-chip>
      </template>
    </v-select>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  // Types
  interface MarketplaceOption {
    name: string
    value: string
    icon: string
    color: string
    description: string
  }

  // Props & Emits
  interface Props {
    modelValue?: string[]
  }

  interface Emits {
    'update:modelValue': [value: string[]]
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // State
  const selectedMarketplaces = ref<string[]>(props.modelValue || [])

  // Marketplace options
  const marketplaceOptions: MarketplaceOption[] = [
    {
      name: 'Amazon',
      value: 'Amazon',
      icon: 'mdi-amazon',
      color: '#FF9900',
      description: 'Maior marketplace mundial',
    },
    {
      name: 'Shopee',
      value: 'Shopee',
      icon: 'mdi-shopping',
      color: '#EE4D2D',
      description: 'Marketplace asiático popular',
    },
    {
      name: 'Mercado Livre',
      value: 'Mercado Livre',
      icon: 'mdi-cart',
      color: '#FFF159',
      description: 'Líder no e-commerce brasileiro',
    },
    {
      name: 'AliExpress',
      value: 'AliExpress',
      icon: 'mdi-shopping-outline',
      color: '#FF6A00',
      description: 'Marketplace chinês',
    },
    {
      name: 'Americanas',
      value: 'Americanas',
      icon: 'mdi-store',
      color: '#E60014',
      description: 'Tradicional varejista brasileiro',
    },
  ]

  // Watch for external changes
  watch(() => props.modelValue, newValue => {
    selectedMarketplaces.value = newValue || []
  })

  watch(selectedMarketplaces, newValue => {
    emit('update:modelValue', newValue)
  }, { deep: true })
</script>

<style scoped>
.marketplace-chip {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.text-white {
  color: white !important;
}
</style>
