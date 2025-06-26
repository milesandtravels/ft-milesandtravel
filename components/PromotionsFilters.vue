<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :fullscreen="$vuetify.display.mobile"
    :max-width="$vuetify.display.mobile ? undefined : '700px'"
    :transition="
      $vuetify.display.mobile ? 'dialog-bottom-transition' : 'dialog-transition'
    "
    scrollable
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Filtrar Promoções</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-container class="pa-0">
          <!-- Campos de alta prioridade - sempre visíveis -->
          <v-row dense class="mb-3">
            <v-col cols="12">
              <v-autocomplete
                :model-value="filters.categories"
                @update:model-value="updateFilter('categories', $event)"
                :items="filterOptions.categories"
                label="Categoria"
                variant="outlined"
                multiple
                chips
                clearable
                closable-chips
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row dense class="mb-3">
            <v-col cols="12" md="6">
              <v-autocomplete
                :model-value="filters.ecommerces"
                @update:model-value="updateFilter('ecommerces', $event)"
                :items="filterOptions.ecommerces"
                label="E-commerces"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                :model-value="filters.promotionTypes"
                @update:model-value="updateFilter('promotionTypes', $event)"
                :items="filterOptions.promotionTypes.options"
                label="Tipo de Promoção"
                variant="outlined"
                item-title="label"
                item-value="value"
                multiple
                chips
                clearable
                closable-chips
              ></v-autocomplete>
            </v-col>
          </v-row>

          <!-- Programas de benefícios - prioridade média -->
          <v-row dense class="mb-3">
            <v-col cols="12" md="6">
              <v-autocomplete
                :model-value="filters.pointsPrograms"
                @update:model-value="updateFilter('pointsPrograms', $event)"
                :items="filterOptions.pointsPrograms"
                label="Programas de Pontos"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                :model-value="filters.milesPrograms"
                @update:model-value="updateFilter('milesPrograms', $event)"
                :items="filterOptions.milesPrograms"
                label="Programas de Milhas"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row dense class="mb-3">
            <v-col cols="12" md="6">
              <v-autocomplete
                :model-value="filters.cashbackPrograms"
                @update:model-value="updateFilter('cashbackPrograms', $event)"
                :items="filterOptions.cashbackPrograms"
                label="Programas de Cashback"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <!-- Ordenação - menor prioridade -->
          <v-divider class="my-3"></v-divider>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                :model-value="filters.orderBy"
                @update:model-value="updateFilter('orderBy', $event)"
                :items="filterOptions.orderBy.options"
                label="Ordenar Por"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                :model-value="filters.order"
                @update:model-value="updateFilter('order', $event)"
                :items="filterOptions.order.options"
                label="Direção da Ordenação"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- Botões de ação fixos na parte inferior -->
      <v-card-actions class="px-6 py-3">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('clear')" class="mr-3">
          Limpar
        </v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('apply')">
          Aplicar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: boolean
    filters: Record<string, any>
    filterOptions: Record<string, any>
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    apply: []
    clear: []
    'update:filters': [filters: Record<string, any>]
  }>()

  const updateFilter = (key: string, value: any) => {
    emit('update:filters', { ...props.filters, [key]: value })
  }
</script>
