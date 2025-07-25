<template>
  <div class="faq-page">
    <!-- Back Button for logged out users -->
    <div v-if="!user" class="back-button-container">
      <v-container>
        <div class="page-header">
          <v-btn
            icon
            variant="text"
            @click="$router.push('/login')"
            class="back-btn"
            size="large"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div class="header-content">
            <h1 class="text-h5 font-weight-bold">Voltar para o Login</h1>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Header Section -->
    <section class="hero-section" :class="{ 'with-back-button': !user }">
      <v-container>
        <div class="text-center py-8 py-md-12">
          <h1 class="hero-title mb-4">Perguntas Frequentes</h1>
          <p class="hero-subtitle">Tire suas dúvidas sobre o Miles&Travels</p>
        </div>
      </v-container>
    </section>

    <!-- FAQ Content -->
    <section class="faq-content">
      <v-container>
        <div class="faq-wrapper">
          <v-expansion-panels
            v-model="openPanel"
            variant="accordion"
            class="faq-panels"
            multiple
          >
            <v-expansion-panel
              v-for="(item, index) in faqItems"
              :key="index"
              :value="index"
              class="faq-panel"
            >
              <v-expansion-panel-title class="faq-question">
                <template v-slot:default="{ expanded }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                      <span class="question-icon mr-4">{{ item.icon }}</span>
                      <span class="question-text">{{ item.question }}</span>
                    </div>
                    <v-icon
                      :class="{ 'rotate-180': expanded }"
                      class="expansion-icon"
                      size="20"
                    >
                      mdi-chevron-down
                    </v-icon>
                  </div>
                </template>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="faq-answer">
                <div v-html="item.answer" class="answer-content"></div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!-- Contact Section -->
        <div class="contact-section mt-12 mt-md-16">
          <v-card class="contact-card" elevation="0">
            <v-card-text class="text-center pa-6 pa-md-8">
              <v-icon size="48" color="primary" class="mb-4">
                mdi-email-outline
              </v-icon>
              <h3 class="contact-title mb-3">Não encontrou sua resposta?</h3>
              <p class="contact-text text-grey-darken-1 mb-4">
                Entre em contato conosco! Nossa equipe está pronta para ajudar
                você.
              </p>

              <!-- Email Contact -->
              <div class="email-contact-wrapper mb-6">
                <p class="text-body-1 mb-3">
                  Envie sua dúvida para nosso e-mail oficial:
                </p>
                <a
                  href="mailto:contato@milesandtravels.com?subject=Dúvida sobre Miles&Travels - FAQ&body=Olá,%0D%0A%0D%0ATenho uma dúvida sobre a plataforma Miles&Travels.%0D%0A%0D%0AMinha dúvida:%0D%0A%0D%0A%0D%0AObrigado!"
                  class="email-link text-h6 font-weight-bold text-primary d-block text-decoration-none mb-4"
                  @click.stop
                >
                  contato@milesandtravels.com
                </a>
              </div>

              <!-- Action Buttons -->
              <div
                class="contact-actions d-flex flex-column flex-sm-row gap-3 justify-center align-center"
              >
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  class="contact-btn"
                  href="mailto:contato@milesandtravels.com?subject=Dúvida sobre Miles&Travels - FAQ&body=Olá,%0D%0A%0D%0ATenho uma dúvida sobre a plataforma Miles&Travels.%0D%0A%0D%0AMinha dúvida:%0D%0A%0D%0A%0D%0AObrigado!"
                  @click.stop
                >
                  <v-icon start>mdi-email-send</v-icon>
                  Enviar E-mail
                </v-btn>

                <v-btn
                  color="primary"
                  variant="outlined"
                  size="large"
                  class="contact-btn"
                  :to="'/terms-of-use'"
                >
                  <v-icon start>mdi-file-document-outline</v-icon>
                  Ver Termos de Uso
                </v-btn>
              </div>

              <!-- Additional Info -->
              <div class="additional-info mt-6">
                <v-divider class="mb-4"></v-divider>
                <p class="text-body-2 text-grey-darken-1 mb-2">
                  <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
                  Respondemos em até 24 horas úteis
                </p>
                <p class="text-subtitle-1 font-weight-bold text-primary">
                  Miles&Travels – Tornando suas compras mais inteligentes.
                </p>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
  interface FAQItem {
    question: string
    answer: string
    icon: string
  }

  // Get user authentication status
  const { value: user } = useSanctumUser()

  // Meta tags
  useHead({
    title: 'FAQ - Miles&Travels | Perguntas Frequentes',
    meta: [
      {
        name: 'description',
        content:
          'Tire suas dúvidas sobre o Miles&Travels. Encontre respostas sobre como funciona nossa plataforma de milhas, pontos e cashback.',
      },
    ],
  })

  // Reactive data
  const openPanel = ref<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      icon: '📌',
      question: 'O que é o Miles&Travels?',
      answer: `Somos uma plataforma que ajuda você a fazer compras estratégicas, mostrando onde estão os 
             <strong>melhores benefícios em pontos, cashback ou milhas</strong> nos principais marketplaces 
             e programas de fidelidade.`,
    },
    {
      icon: '💡',
      question: 'Como funciona a busca de produtos?',
      answer: `Você digita o produto que quer comprar e nós buscamos <strong>automaticamente</strong> em diversas 
             plataformas. Em segundos, mostramos <strong>onde vale mais a pena comprar</strong>, com base nas 
             promoções e regras de cada programa.`,
    },
    {
      icon: '🧠',
      question: 'Preciso entender de milhas ou programas de pontos para usar?',
      answer: `Nada disso! A gente explica o que realmente importa: <strong>quantos pontos você vai ganhar</strong> 
             e <strong>qual é o melhor programa para cada momento</strong>. Tudo de forma simples e prática.`,
    },
    {
      icon: '💰',
      question: 'O sistema é gratuito?',
      answer: `Atualmente estamos em fase de testes e <strong>não cobramos nada</strong>, mas futuramente o acesso 
             será feito por <strong>assinatura mensal</strong>. Vamos avisar com antecedência 😉`,
    },
    {
      icon: '🔐',
      question: 'Como faço meu cadastro?',
      answer: `É só clicar em "Cadastrar", preencher seus dados e confirmar pelo link que será enviado por e-mail. 
             Em poucos minutos você já pode começar a usar.`,
    },
    {
      icon: '😓',
      question: 'Esqueci minha senha, e agora?',
      answer: `Sem crise! Na tela de login, clique em <strong>"Esqueci minha senha"</strong> e siga as instruções. 
             Você receberá um e-mail para criar uma nova senha rapidinho.`,
    },
    {
      icon: '👥',
      question: 'Quem pode usar o Miles&Travels?',
      answer: `Qualquer pessoa interessada em <strong>economizar, viajar mais barato ou acumular pontos</strong>. 
             Também atendemos <strong>gestores de viagens ou milhas</strong> que fazem compras para empresas ou terceiros.`,
    },
    {
      icon: '📞',
      question: 'Como entro em contato com vocês?',
      answer: `Você pode nos enviar um e-mail para <strong>contato@milesandtravels.com</strong>. Respondemos todas as mensagens 
             em até 24 horas úteis. Nossa equipe está sempre pronta para ajudar! 💬`,
    },
  ]
</script>

<style scoped>
  .faq-page {
    min-height: 100vh;
    background: #fafbfc;
  }

  .back-button-container {
    background: #fafbfc;
    padding-top: 16px;
  }

  .page-header {
    display: flex;
    align-items: center;
    padding: 0 0 16px 0;
  }

  .back-btn {
    margin-right: 12px;
    flex-shrink: 0;
  }

  .header-content {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .hero-section {
    background: linear-gradient(
      135deg,
      rgb(var(--v-theme-primary)) 0%,
      rgba(var(--v-theme-primary), 0.9) 100%
    );
    color: white;
    position: relative;
    overflow: hidden;
  }

  .hero-section.with-back-button {
    padding-top: 2rem;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.08"/><circle cx="75" cy="75" r="1.2" fill="white" opacity="0.06"/><circle cx="50" cy="10" r="0.8" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  }

  .hero-title {
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    position: relative;
    z-index: 1;
    margin-bottom: 0.5rem;
  }

  .hero-subtitle {
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    opacity: 0.95;
    position: relative;
    z-index: 1;
    font-weight: 400;
  }

  .faq-content {
    padding: 3rem 0 5rem;
    background: #fafbfc;
  }

  @media (min-width: 768px) {
    .faq-content {
      padding: 4rem 0 6rem;
    }
  }

  .faq-wrapper {
    max-width: 900px;
    margin: 0 auto;
  }

  .faq-panel {
    margin-bottom: 1.5rem;
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 1px 2px rgba(0, 0, 0, 0.06);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #e5e7eb;
    background: white;
  }

  .faq-panel:hover {
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 2px 4px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
    border-color: rgba(var(--v-theme-primary), 0.2);
  }

  .faq-panel :deep(.v-expansion-panel__shadow) {
    display: none;
  }

  .faq-question {
    padding: 2rem 2rem 2rem 2rem;
    background: white;
    border: none;
    min-height: auto !important;
    transition: background-color 0.2s ease;
  }

  .faq-question:hover {
    background: #f8fafc;
  }

  @media (min-width: 768px) {
    .faq-question {
      padding: 2.25rem 2.5rem;
    }
  }

  .question-icon {
    font-size: 1.75rem;
    flex-shrink: 0;
    filter: grayscale(0.2);
  }

  .question-text {
    font-weight: 600;
    font-size: 1.1rem;
    line-height: 1.5;
    color: #1f2937;
    letter-spacing: -0.01em;
  }

  @media (min-width: 768px) {
    .question-text {
      font-size: 1.2rem;
    }
  }

  .expansion-icon {
    color: #6b7280;
    transition:
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      color 0.2s ease;
    margin-left: 1rem;
  }

  .expansion-icon.rotate-180 {
    transform: rotate(180deg);
    color: rgb(var(--v-theme-primary));
  }

  .faq-question :deep(.v-expansion-panel-title__overlay) {
    display: none;
  }

  .faq-question :deep(.v-expansion-panel-title__icon) {
    display: none;
  }

  .faq-answer {
    background: white;
  }

  .faq-answer :deep(.v-expansion-panel-text__wrapper) {
    padding: 0 2rem 2.25rem 2rem;
    border-top: 1px solid #f1f5f9;
  }

  @media (min-width: 768px) {
    .faq-answer :deep(.v-expansion-panel-text__wrapper) {
      padding: 0 2.5rem 2.5rem 2.5rem;
    }
  }

  .answer-content {
    font-size: 1rem;
    line-height: 1.7;
    color: #4b5563;
    font-weight: 400;
    letter-spacing: -0.005em;
    margin-top: 1rem;
  }

  @media (min-width: 768px) {
    .answer-content {
      font-size: 1.05rem;
      line-height: 1.75;
    }
  }

  .answer-content :deep(strong) {
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
  }

  .contact-card {
    background: white;
    border-radius: 20px !important;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.05),
      0 10px 25px rgba(0, 0, 0, 0.04);
    border: 1px solid #f1f5f9;
  }

  .contact-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    letter-spacing: -0.02em;
  }

  @media (min-width: 768px) {
    .contact-title {
      font-size: 2rem;
    }
  }

  .contact-text {
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 520px;
    margin: 0 auto;
    color: #6b7280;
    font-weight: 400;
  }

  /* Email Contact Styles */
  .email-contact-wrapper {
    background: rgba(var(--v-theme-primary), 0.05);
    border-radius: 12px;
    padding: 20px;
    margin: 0 auto;
    max-width: 400px;
  }

  .email-link {
    transition: all 0.2s ease;
    border-radius: 6px;
    padding: 8px 12px;
    margin: -8px -12px;
    display: inline-block;
  }

  .email-link:hover {
    background-color: rgba(15, 43, 70, 0.1);
    text-decoration: underline !important;
    transform: scale(1.02);
  }

  .email-link:active {
    transform: scale(0.98);
  }

  .contact-actions {
    gap: 12px;
  }

  .contact-btn {
    border-radius: 12px !important;
    text-transform: none;
    font-weight: 600;
    padding: 0 2rem;
    height: 48px;
    font-size: 1rem;
    letter-spacing: -0.005em;
    min-width: 160px;
  }

  .additional-info {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 12px;
    padding: 16px;
    margin: 0 -16px;
  }

  @media (min-width: 768px) {
    .additional-info {
      margin: 0 -32px;
      padding: 20px 32px;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 599px) {
    .contact-actions {
      flex-direction: column;
      width: 100%;
    }

    .contact-btn {
      width: 100%;
      max-width: 280px;
    }

    .email-contact-wrapper {
      margin: 0;
      padding: 16px;
    }

    .back-button-container {
      padding-top: 12px;
    }

    .page-header {
      padding: 0 0 12px 0;
    }

    .back-btn {
      margin-right: 8px;
    }

    .header-content h1 {
      font-size: 1.25rem !important;
    }

    .hero-section.with-back-button {
      padding-top: 1rem;
    }
  }

  /* Dark theme support */
  :deep(.v-theme--dark) .faq-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  :deep(.v-theme--dark) .faq-panel {
    background: rgb(var(--v-theme-surface));
  }

  :deep(.v-theme--dark) .faq-question,
  :deep(.v-theme--dark) .faq-answer {
    background: rgb(var(--v-theme-surface)) !important;
  }

  :deep(.v-theme--dark) .contact-card {
    background: rgb(var(--v-theme-surface)) !important;
  }

  :deep(.v-theme--dark) .email-contact-wrapper {
    background: rgba(var(--v-theme-primary), 0.1);
  }

  :deep(.v-theme--dark) .additional-info {
    background: rgba(255, 255, 255, 0.05);
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .faq-panel {
      transition: none;
    }

    .faq-panel:hover {
      transform: none;
    }

    .email-link:hover {
      transform: none;
    }

    .faq-panel :deep(.v-expansion-panel-title__icon) {
      transition: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .faq-panel {
      border: 2px solid rgb(var(--v-theme-primary));
    }

    .faq-question {
      border-bottom: 2px solid rgb(var(--v-theme-primary));
    }

    .email-contact-wrapper {
      border: 2px solid rgb(var(--v-theme-primary));
    }
  }

  /* Focus styles for keyboard navigation */
  .email-link:focus-visible,
  .contact-btn:focus-visible,
  .back-btn:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }
</style>
