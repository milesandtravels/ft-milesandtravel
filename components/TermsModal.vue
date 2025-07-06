<template>
  <v-dialog
    v-model="showModal"
    :persistent="true"
    :no-click-animation="true"
    max-width="600"
    class="terms-modal"
  >
    <v-card class="pa-0">
      <!-- Header -->
      <v-card-title class="text-h6 font-weight-bold pa-4 pb-2">
        <v-icon class="mr-2" color="primary">mdi-file-document-outline</v-icon>
        Termos de Uso
      </v-card-title>

      <!-- Content -->
      <v-card-text class="pa-4 pt-2">
        <div class="terms-content">
          <div class="text-body-2 text-medium-emphasis mb-4">
            <strong>Última atualização:</strong> 24 de junho de 2025
          </div>

          <div class="terms-scroll-area">
            <div class="mb-4">
              <p class="text-body-2 mb-3">
                Este documento estabelece os termos de uso da plataforma
                <strong>Miles&Travels</strong>, pertencente a
                <strong>Miles&Travels</strong>. Ao utilizar nossos serviços,
                você concorda com as condições aqui descritas.
              </p>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                1. O que é o Miles&Travels
              </h3>
              <p class="text-body-2">
                O Miles&Travels é uma plataforma digital que auxilia os usuários
                a realizarem compras estratégicas, identificando as melhores
                oportunidades de acúmulo de pontos, cashback ou milhas nos
                principais marketplaces e programas de fidelidade do mercado.
              </p>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                2. Aceitação dos Termos
              </h3>
              <p class="text-body-2">
                Ao acessar ou utilizar o Miles&Travels, o usuário declara que
                leu, compreendeu e concorda com estes Termos de Uso. Caso não
                concorde com alguma condição, recomendamos que não utilize a
                plataforma.
              </p>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                3. Cadastro e Acesso
              </h3>
              <ul class="text-body-2 pl-4">
                <li class="mb-1">
                  Para utilizar algumas funcionalidades, o usuário deve se
                  cadastrar informando nome, e-mail e criar uma senha.
                </li>
                <li class="mb-1">
                  O acesso é individual, pessoal e intransferível.
                </li>
                <li class="mb-1">
                  É responsabilidade do usuário manter suas credenciais de
                  acesso seguras.
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                4. Funcionamento da Plataforma
              </h3>
              <ul class="text-body-2 pl-4">
                <li class="mb-1">
                  A busca de produtos é realizada automaticamente a partir da
                  palavra-chave informada pelo usuário.
                </li>
                <li class="mb-1">
                  Os resultados exibem onde estão os melhores benefícios, com
                  base em regras públicas de cada programa.
                </li>
                <li class="mb-1">
                  A plataforma não realiza vendas, apenas indicações e
                  comparações.
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                5. Regras de Uso
              </h3>
              <ul class="text-body-2 pl-4">
                <li class="mb-1">
                  É proibido utilizar a plataforma para fins ilícitos,
                  fraudulentos ou que infrinjam direitos de terceiros.
                </li>
                <li class="mb-1">
                  É vedado o uso de engenharia reversa, cópia, modificação ou
                  distribuição do conteúdo da plataforma sem autorização.
                </li>
                <li class="mb-1">
                  O uso automatizado (bots ou scrapers) não é permitido.
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                6. Responsabilidades e Limitações
              </h3>
              <ul class="text-body-2 pl-4">
                <li class="mb-1">
                  A Miles&Travels se compromete a manter a plataforma
                  disponível, mas não garante que ela estará livre de falhas,
                  interrupções ou imprecisões.
                </li>
                <li class="mb-1">
                  Os dados exibidos são obtidos de fontes externas, e podem
                  estar sujeitos a alterações sem aviso prévio.
                </li>
                <li class="mb-1">
                  A Miles&Travels não se responsabiliza por compras realizadas
                  em plataformas de terceiros.
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                7. Propriedade Intelectual
              </h3>
              <p class="text-body-2">
                Todos os direitos sobre a marca, logotipo, layout, código-fonte,
                textos e demais elementos da plataforma pertencem exclusivamente
                à Miles&Travels. É proibido o uso sem autorização prévia por
                escrito.
              </p>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                8. Política de Privacidade
              </h3>
              <p class="text-body-2">
                A utilização da plataforma está sujeita à nossa Política de
                Privacidade (em breve). Ela descreve como coletamos, armazenamos
                e utilizamos os dados dos usuários de forma segura e
                transparente.
              </p>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                9. Cancelamento e Suspensão de Conta
              </h3>
              <ul class="text-body-2 pl-4">
                <li class="mb-1">
                  O usuário pode cancelar sua conta a qualquer momento.
                </li>
                <li class="mb-1">
                  A Miles&Travels reserva-se o direito de suspender ou encerrar
                  contas que violem estes termos, sem necessidade de aviso
                  prévio.
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                10. Alterações dos Termos
              </h3>
              <p class="text-body-2">
                Podemos atualizar estes termos a qualquer momento. Os usuários
                serão notificados em caso de alterações significativas. O uso
                contínuo da plataforma após tais alterações implica aceitação
                dos novos termos.
              </p>
            </div>

            <div class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                11. Foro e Legislação Aplicável
              </h3>
              <p class="text-body-2">
                Estes termos serão regidos pelas leis brasileiras. Fica eleito o
                foro da Comarca de
                <strong>Curitiba – PR</strong>, para dirimir quaisquer dúvidas
                oriundas deste contrato, com renúncia de qualquer outro, por
                mais privilegiado que seja.
              </p>
            </div>

            <div class="text-center mt-6 mb-4">
              <p class="text-body-2 text-medium-emphasis">
                Caso tenha dúvidas, entre em contato pelo nosso e-mail oficial
                contato@milesandtravels.com.
              </p>
              <p
                class="text-subtitle-2 font-weight-bold mt-2"
                style="color: #1976d2"
              >
                Miles&Travels – Tornando suas compras mais inteligentes.
              </p>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-4 pt-2">
        <div class="w-100">
          <v-checkbox
            v-model="termsAccepted"
            color="primary"
            hide-details
            class="mb-3"
          >
            <template #label>
              <span class="text-body-2">
                Li e concordo com os
                <strong>Termos de Uso</strong> da plataforma Miles&Travels
              </span>
            </template>
          </v-checkbox>

          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              variant="elevated"
              :disabled="!termsAccepted"
              @click="acceptTerms"
              class="px-6"
            >
              <v-icon left class="mr-1">mdi-check</v-icon>
              Continuar
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

  // Reactive variables
  const showModal = ref(false)
  const termsAccepted = ref(false)

  // Check if terms were already accepted
  const checkTermsAcceptance = () => {
    if (process.client) {
      const accepted = localStorage.getItem('miles-travels-terms-accepted')
      if (!accepted || accepted !== 'true') {
        showModal.value = true
      }
    }
  }

  // Accept terms and save to localStorage
  const acceptTerms = () => {
    if (termsAccepted.value && process.client) {
      localStorage.setItem('miles-travels-terms-accepted', 'true')
      localStorage.setItem('miles-travels-terms-date', new Date().toISOString())
      showModal.value = false
    }
    emit('terms-accepted')
    console.log('🔥 EVENTO terms-accepted EMITIDO!')
  }

  // ADICIONAR APENAS ESTA LINHA
  const emit = defineEmits(['terms-accepted'])

  // Check on component mount
  onMounted(() => {
    checkTermsAcceptance()
  })
</script>

<style scoped>
  .terms-modal :deep(.v-dialog) {
    margin: 12px;
  }

  .terms-content {
    max-height: 60vh;
    overflow-y: auto;
  }

  .terms-scroll-area {
    scroll-behavior: smooth;
  }

  .terms-scroll-area::-webkit-scrollbar {
    width: 6px;
  }

  .terms-scroll-area::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .terms-scroll-area::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .terms-scroll-area::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Mobile First Responsive */
  @media (max-width: 599px) {
    .terms-modal :deep(.v-dialog) {
      margin: 8px;
    }

    .terms-content {
      max-height: 50vh;
    }

    .v-card-title {
      font-size: 1.125rem !important;
      padding: 16px 16px 8px 16px !important;
    }

    .v-card-text {
      padding: 8px 16px !important;
    }

    .v-card-actions {
      padding: 8px 16px 16px 16px !important;
    }
  }

  @media (max-width: 399px) {
    .terms-modal :deep(.v-dialog) {
      margin: 4px;
    }

    .terms-content {
      max-height: 45vh;
    }
  }

  /* Ensure text is readable */
  .text-body-2 {
    line-height: 1.5 !important;
  }

  .text-subtitle-1 {
    line-height: 1.4 !important;
  }

  /* Checkbox styling */
  :deep(.v-checkbox .v-selection-control__wrapper) {
    align-items: flex-start;
  }

  :deep(.v-checkbox .v-label) {
    opacity: 1 !important;
    line-height: 1.4;
  }

  /* Button styling */
  .v-btn:disabled {
    opacity: 0.6 !important;
  }

  /* List styling */
  ul {
    list-style-type: disc;
    margin-left: 8px;
  }

  li {
    line-height: 1.5;
  }
</style>
