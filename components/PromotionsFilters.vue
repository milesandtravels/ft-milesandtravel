<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :fullscreen="$vuetify.display.mobile"
    :max-width="$vuetify.display.mobile ? undefined : '700px'"
    :transition="
      $vuetify.display.mobile ? 'dialog-bottom-transition' : 'dialog-transition'
    "
    persistent
    scrollable
  >
    <v-card>
      <!-- Header padronizado -->
      <ModalHeader
        title="Filtrar Promoções"
        @close="$emit('update:modelValue', false)"
      />

      <v-divider />

      <v-card-text class="pa-4 pa-md-6" style="max-height: 70vh">
        <v-container class="pa-0">
          <!-- Campos de alta prioridade - sempre visíveis -->
          <v-row class="gy-2">
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

            <!-- E-commerces e Tipo de Promoção -->
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
                    :prepend-avatar="(item as any).logo_url"
                    :text="(item as any).name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>



            <!-- Programas de benefícios -->
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
                    :prepend-avatar="(item as any).logo_url"
                    :text="(item as any).name"
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
                    :prepend-avatar="(item as any).logo_url"
                    :text="(item as any).name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>

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

            <!-- Ordenação -->
            <v-col cols="12">
              <v-divider class="my-2" />
            </v-col>
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

      <v-divider />

      <!-- Footer padronizado -->
      <v-card-actions class="pa-4 pa-md-6 bg-grey-lighten-5">
        <v-btn
          variant="outlined"
          color="grey"
          @click="$emit('clear')"
          prepend-icon="mdi-refresh"
        >
          Limpar
        </v-btn>

        <v-spacer />

        <v-btn
          variant="outlined"
          @click="$emit('update:modelValue', false)"
          class="me-2"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          @click="$emit('apply')"
          prepend-icon="mdi-check"
        >
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
