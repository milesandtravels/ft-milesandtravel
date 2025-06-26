<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Filtros</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('clear')">Limpar</v-btn>
        <v-btn text @click="$emit('apply')">Aplicar</v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                :model-value="filters.categories"
                @update:model-value="updateFilter('categories', $event)"
                :items="filterOptions.categories"
                label="Categoria de ecommerce"
                variant="outlined"
                multiple
                chips
                clearable
                closable-chips
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :model-value="filters.promotionTypes"
                @update:model-value="updateFilter('promotionTypes', $event)"
                :items="filterOptions.promotionTypes.options"
                label="Tipo de promoção"
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

          <v-row>
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
          </v-row>

          <v-row>
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

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                :model-value="filters.orderBy"
                @update:model-value="updateFilter('orderBy', $event)"
                :items="filterOptions.orderBy.options"
                label="Ordenar por"
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
                label="Ordem"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
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
