<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6 text-center">Promoções</h1>
      </v-col>
    </v-row>
    
    <v-row v-if="pending" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">Carregando promoções...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="error" justify="center">
      <v-col cols="12" class="text-center">
        <v-alert type="error" variant="tonal" class="mb-4">
          <v-alert-title>Erro ao carregar dados</v-alert-title>
          Não foi possível carregar as promoções. Tente novamente mais tarde.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="promotions && promotions.length > 0" class="ga-4">
      <v-col 
        v-for="promotion in promotions" 
        :key="promotion.id"
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
      >
        <v-card 
          class="promotion-card h-100" 
          elevation="2"
          hover
        >
          <v-card-text class="pa-4">
            <!-- E-commerce Section -->
            <div class="ecommerce-section mb-4">
              <div class="d-flex align-center mb-2">
                <v-avatar size="32" class="me-3">
                  <v-img 
                    :src="promotion.ecommerce.logo_url" 
                    :alt="promotion.ecommerce.name"
                    cover
                  >
                    <template v-slot:error>
                      <v-icon icon="mdi-store" size="20"></v-icon>
                    </template>
                  </v-img>
                </v-avatar>
                <div>
                  <p class="text-caption text-medium-emphasis mb-0">E-commerce</p>
                  <p class="text-body-2 font-weight-medium mb-0">{{ promotion.ecommerce.name }}</p>
                </div>
              </div>
            </div>

            <!-- Program Section -->
            <div class="program-section mb-4">
              <div class="d-flex align-center mb-2">
                <v-avatar size="32" class="me-3">
                  <v-img 
                    :src="promotion.program.logo_url" 
                    :alt="promotion.program.name"
                    cover
                  >
                    <template v-slot:error>
                      <v-icon icon="mdi-card-giftcard" size="20"></v-icon>
                    </template>
                  </v-img>
                </v-avatar>
                <div>
                  <p class="text-caption text-medium-emphasis mb-0">Programa</p>
                  <p class="text-body-2 font-weight-medium mb-0">{{ promotion.program.name }}</p>
                </div>
              </div>
            </div>

            <!-- Current Value Section -->
            <div class="current-value-section">
              <v-divider class="mb-3"></v-divider>
              <div class="text-center">
                <p class="text-caption text-medium-emphasis mb-1">Valor Atual da Promoção</p>
                <p class="text-h5 font-weight-bold text-primary mb-0">
                   {{ formatValue(promotion.current_value, promotion.program_type) }}
                 </p>
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-btn 
              variant="outlined" 
              color="primary" 
              block
              size="small"
            >
              Ver Detalhes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
       <v-col cols="12" class="text-center">
         <v-card class="pa-8" variant="outlined">
           <v-icon icon="mdi-package-variant" size="64" class="text-medium-emphasis mb-4"></v-icon>
           <h3 class="text-h6 mb-2">Nenhuma promoção encontrada</h3>
           <p class="text-body-2 text-medium-emphasis">
             Não há promoções disponíveis no momento.
           </p>
         </v-card>
       </v-col>
     </v-row>

     <!-- Paginação -->
     <v-row v-if="meta && meta.last_page > 1" justify="center" class="mt-6">
       <v-col cols="12">
         <div class="d-flex justify-center align-center flex-wrap ga-2">
           <!-- Botão Primeira Página -->
           <v-btn 
             :disabled="meta.current_page === 1 || pending"
             @click="goToPage(1)"
             variant="outlined"
             size="small"
             icon="mdi-page-first"
           ></v-btn>

           <!-- Botão Página Anterior -->
           <v-btn 
             :disabled="meta.current_page === 1 || pending"
             @click="goToPage(meta.current_page - 1)"
             variant="outlined"
             size="small"
             icon="mdi-chevron-left"
           ></v-btn>

           <!-- Números das páginas -->
           <template v-for="page in getPaginationPages()" :key="page">
             <v-btn
               v-if="page !== '...'"
               :variant="page === meta.current_page ? 'flat' : 'outlined'"
               :color="page === meta.current_page ? 'primary' : 'default'"
               @click="goToPage(page)"
               :disabled="pending"
               size="small"
               min-width="40"
             >
               {{ page }}
             </v-btn>
             <span v-else class="px-2 text-medium-emphasis">...</span>
           </template>

           <!-- Botão Próxima Página -->
           <v-btn 
             :disabled="meta.current_page === meta.last_page || pending"
             @click="goToPage(meta.current_page + 1)"
             variant="outlined"
             size="small"
             icon="mdi-chevron-right"
           ></v-btn>

           <!-- Botão Última Página -->
           <v-btn 
             :disabled="meta.current_page === meta.last_page || pending"
             @click="goToPage(meta.last_page)"
             variant="outlined"
             size="small"
             icon="mdi-page-last"
           ></v-btn>
         </div>

         <!-- Informações da paginação -->
         <div class="text-center mt-4">
           <p class="text-body-2 text-medium-emphasis">
             Mostrando {{ meta.from }} a {{ meta.to }} de {{ meta.total }} resultados
             (Página {{ meta.current_page }} de {{ meta.last_page }})
           </p>
         </div>
       </v-col>
     </v-row>
   </v-container>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  interface Program {
    id: number,
    name: string,
    logo_url: string,
    value_per_mile?: number,
  }
  interface Ecommerce {
    id: number,
    name: string,
    logo_url: string
  }

  type ProgramType = 'miles' | 'points' | 'cashback'
  interface Promotion {
    id: number,
    current_value: number,
    program_type: ProgramType,
    program: Program,
    ecommerce: Ecommerce
  }

  interface Links {
    first: string,
    last: string,
    prev: string,
    next: string,
  }

  interface Link {
    url: string,
    label: string,
    active: boolean,

  }

  interface Meta {
    current_page: number,
    from: number,
    last_page: number,
    path: string,
    per_page: number,
    to: number,
    total: number,
    links: Link[],
  }

  interface Response {
    data: Promotion[],
    links: Links,
    meta: Meta,
  }

// Estado da paginação
const route = useRoute()
const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = ref(Number(route.query.per_page) || 15)

// Fetch inicial
const { data: initialResponse, pending: initialPending, error: initialError } = await useSanctumFetch<Response>('/api/promotions', {
  query: {
    page: currentPage.value,
    per_page: itemsPerPage.value
  }
})

const promotions = ref<Promotion[]>(initialResponse.value?.data || [])
const meta = ref<Meta | undefined>(initialResponse.value?.meta)
const links = ref<Links | undefined>(initialResponse.value?.links)
const pending = ref(initialPending.value)
const error = ref(initialError.value)

// Função para navegar entre páginas
const goToPage = async (page: number) => {
  currentPage.value = page
  pending.value = true
  
  try {
    const { data: newResponse } = await useSanctumFetch<Response>('/api/promotions', {
      query: {
        page: currentPage.value,
        per_page: itemsPerPage.value
      }
    })
    
    promotions.value = newResponse.value?.data || []
    meta.value = newResponse.value?.meta
    links.value = newResponse.value?.links
    error.value = null
  } catch (err) {
    console.error('Erro ao carregar página:', err)
    error.value = err
  } finally {
    pending.value = false
  }
}

// Função para gerar os números das páginas para exibição
const getPaginationPages = () => {
  if (!meta.value) return []
  
  const current = meta.value.current_page
  const last = meta.value.last_page
  const pages: (number | string)[] = []
  
  // Se há 7 páginas ou menos, mostra todas
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
    return pages
  }
  
  // Sempre mostra a primeira página
  pages.push(1)
  
  // Se a página atual está longe do início, adiciona "..."
  if (current > 4) {
    pages.push('...')
  }
  
  // Páginas ao redor da atual
  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }
  
  // Se a página atual está longe do fim, adiciona "..."
  if (current < last - 3) {
    pages.push('...')
  }
  
  // Sempre mostra a última página
  if (!pages.includes(last)) {
    pages.push(last)
  }
  
  return pages
}



// Função para formatar valores baseado no tipo
const formatValue = (value: number, type: ProgramType): string => {
  switch (type) {
    case 'miles':
        return `${value} pontos/R$`
    case 'points':
      return `${value} milhas/R$`
    case 'cashback':
      return `${value}% cashback`
    default:
      return value.toString()
  }
}
</script>

<style scoped>
.promotion-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-radius: 12px;
}

.promotion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.ecommerce-section,
.program-section {
  border-radius: 8px;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  padding: 12px;
}

.current-value-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
  border-radius: 8px;
  padding: 16px;
}

.h-100 {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.h-100 .v-card-text {
  flex-grow: 1;
}
</style>