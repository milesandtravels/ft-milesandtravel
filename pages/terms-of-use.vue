.bottom-spacer { height: 80px; }
<template>
  <div class="terms-page">
    <!-- Main Content -->
    <v-container class="pa-0" fluid>
      <div class="terms-container">
        <!-- Page Header -->
        <div class="page-header">
          <v-btn
            icon
            variant="text"
            @click="value ? $router.go(-1) : $router.push('/login')"
            class="back-btn"
            size="large"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <div class="header-content">
            <v-icon class="mr-2" color="primary" size="28"
              >mdi-file-document-outline</v-icon
            >
            <h1 class="text-h5 font-weight-bold">Termos de Uso</h1>
          </div>
        </div>
        <!-- Last Update Info -->
        <div class="update-info">
          <v-card variant="outlined" class="mb-6">
            <v-card-text class="py-3">
              <div class="d-flex align-center">
                <v-icon color="primary" size="20" class="mr-2"
                  >mdi-calendar-clock</v-icon
                >
                <span class="text-body-2 text-medium-emphasis">
                  <strong>Última atualização:</strong> 24 de junho de 2025
                </span>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Terms Content -->
        <div class="terms-content">
          <!-- Introduction -->
          <section class="mb-6">
            <p class="text-body-1 mb-4 text-justify">
              Este documento estabelece os termos de uso da plataforma
              <strong class="text-primary">Miles&Travels</strong>, pertencente a
              <strong class="text-primary">Miles&Travels</strong>. Ao utilizar
              nossos serviços, você concorda com as condições aqui descritas.
            </p>
          </section>

          <!-- Section 1 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              1. O que é o Miles&Travels
            </h2>
            <p class="text-body-1 text-justify">
              O Miles&Travels é uma plataforma digital que auxilia os usuários a
              realizarem compras estratégicas, identificando as melhores
              oportunidades de acúmulo de pontos, cashback ou milhas nos
              principais marketplaces e programas de fidelidade do mercado.
            </p>
          </section>

          <!-- Section 2 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              2. Aceitação dos Termos
            </h2>
            <p class="text-body-1 text-justify">
              Ao acessar ou utilizar o Miles&Travels, o usuário declara que leu,
              compreendeu e concorda com estes Termos de Uso. Caso não concorde
              com alguma condição, recomendamos que não utilize a plataforma.
            </p>
          </section>

          <!-- Section 3 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              3. Cadastro e Acesso
            </h2>
            <ul class="terms-list">
              <li class="mb-2">
                Para utilizar algumas funcionalidades, o usuário deve se
                cadastrar informando nome, e-mail e criar uma senha.
              </li>
              <li class="mb-2">
                O acesso é individual, pessoal e intransferível.
              </li>
              <li class="mb-2">
                É responsabilidade do usuário manter suas credenciais de acesso
                seguras.
              </li>
            </ul>
          </section>

          <!-- Section 4 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              4. Funcionamento da Plataforma
            </h2>
            <ul class="terms-list">
              <li class="mb-2">
                A busca de produtos é realizada automaticamente a partir da
                palavra-chave informada pelo usuário.
              </li>
              <li class="mb-2">
                Os resultados exibem onde estão os melhores benefícios, com base
                em regras públicas de cada programa.
              </li>
              <li class="mb-2">
                A plataforma não realiza vendas, apenas indicações e
                comparações.
              </li>
            </ul>
          </section>

          <!-- Section 5 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              5. Regras de Uso
            </h2>
            <ul class="terms-list">
              <li class="mb-2">
                É proibido utilizar a plataforma para fins ilícitos,
                fraudulentos ou que infrinjam direitos de terceiros.
              </li>
              <li class="mb-2">
                É vedado o uso de engenharia reversa, cópia, modificação ou
                distribuição do conteúdo da plataforma sem autorização.
              </li>
              <li class="mb-2">
                O uso automatizado (bots ou scrapers) não é permitido.
              </li>
            </ul>
          </section>

          <!-- Section 6 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              6. Responsabilidades e Limitações
            </h2>
            <ul class="terms-list">
              <li class="mb-2">
                A Miles&Travels se compromete a manter a plataforma disponível,
                mas não garante que ela estará livre de falhas, interrupções ou
                imprecisões.
              </li>
              <li class="mb-2">
                Os dados exibidos são obtidos de fontes externas, e podem estar
                sujeitos a alterações sem aviso prévio.
              </li>
              <li class="mb-2">
                A Miles&Travels não se responsabiliza por compras realizadas em
                plataformas de terceiros.
              </li>
            </ul>
          </section>

          <!-- Section 7 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              7. Propriedade Intelectual
            </h2>
            <p class="text-body-1 text-justify">
              Todos os direitos sobre a marca, logotipo, layout, código-fonte,
              textos e demais elementos da plataforma pertencem exclusivamente à
              Miles&Travels. É proibido o uso sem autorização prévia por
              escrito.
            </p>
          </section>

          <!-- Section 8 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              8. Política de Privacidade
            </h2>
            <p class="text-body-1 text-justify">
              A utilização da plataforma está sujeita à nossa Política de
              Privacidade (em breve). Ela descreve como coletamos, armazenamos e
              utilizamos os dados dos usuários de forma segura e transparente.
            </p>
          </section>

          <!-- Section 9 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              9. Cancelamento e Suspensão de Conta
            </h2>
            <ul class="terms-list">
              <li class="mb-2">
                O usuário pode cancelar sua conta a qualquer momento.
              </li>
              <li class="mb-2">
                A Miles&Travels reserva-se o direito de suspender ou encerrar
                contas que violem estes termos, sem necessidade de aviso prévio.
              </li>
            </ul>
          </section>

          <!-- Section 10 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              10. Alterações dos Termos
            </h2>
            <p class="text-body-1 text-justify">
              Podemos atualizar estes termos a qualquer momento. Os usuários
              serão notificados em caso de alterações significativas. O uso
              contínuo da plataforma após tais alterações implica aceitação dos
              novos termos.
            </p>
          </section>

          <!-- Section 11 -->
          <section class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 text-primary">
              11. Foro e Legislação Aplicável
            </h2>
            <p class="text-body-1 text-justify">
              Estes termos serão regidos pelas leis brasileiras. Fica eleito o
              foro da Comarca de
              <strong class="text-primary">Curitiba – PR</strong>, para dirimir
              quaisquer dúvidas oriundas deste contrato, com renúncia de
              qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <!-- Contact Section -->
          <section class="contact-section">
            <v-card variant="tonal" color="primary" class="mb-6">
              <v-card-text class="text-center py-6">
                <v-icon color="primary" size="32" class="mb-3"
                  >mdi-email-outline</v-icon
                >
                <p class="text-body-1 mb-2">
                  Caso tenha dúvidas, entre em contato pelo nosso e-mail oficial
                </p>
                <a
                  href="mailto:contato@milesandtravels.com?subject=Dúvida sobre Termos de Uso - Miles&Travels&body=Olá,%0D%0A%0D%0ATenho uma dúvida sobre os Termos de Uso da plataforma Miles&Travels.%0D%0A%0D%0ADescreva sua dúvida:%0D%0A%0D%0A%0D%0AObrigado!"
                  class="email-link text-h6 font-weight-bold text-primary mb-3 d-block text-decoration-none"
                  @click.stop
                >
                  contato@milesandtravels.com
                </a>
                <p class="text-subtitle-1 font-weight-bold text-primary">
                  Miles&Travels – Tornando suas compras mais inteligentes.
                </p>
              </v-card-text>
            </v-card>
          </section>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
  // Meta tags for SEO

    const { value } = useSanctumUser()

  useSeoMeta({
    title: 'Termos de Uso - Miles&Travels',
    description:
      'Termos de uso da plataforma Miles&Travels. Conheça as condições para utilização dos nossos serviços.',
    keywords: 'termos de uso, miles and travels, condições de uso, política',
  })

  definePageMeta({
    middleware: ['sanctum:guest'],
    layout: 'default'
  })
 
</script>

<style scoped>
  .terms-page {
    min-height: 100vh;
    background-color: #fafafa;
  }

  .page-header {
    display: flex;
    align-items: center;
    padding: 16px 0 24px 0;
    margin-bottom: 8px;
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

  .terms-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 16px;
    padding-bottom: 80px;
  }

  .update-info {
    margin-top: 16px;
  }

  .terms-content {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .terms-list {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
  }

  .terms-list li {
    position: relative;
    padding-left: 24px;
    line-height: 1.6;
    color: rgba(0, 0, 0, 0.87);
  }

  .terms-list li::before {
    content: '•';
    color: #1976d2;
    font-weight: bold;
    font-size: 18px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .contact-section {
    margin-top: 32px;
  }

  .bottom-spacer {
    height: 80px;
  }

  .text-justify {
    text-align: justify;
    line-height: 1.6;
  }

  /* Mobile First Responsive Design */
  @media (max-width: 599px) {
    .terms-container {
      padding: 12px;
      padding-bottom: 80px;
    }

    .page-header {
      padding: 12px 0 20px 0;
      margin-bottom: 4px;
    }

    .back-btn {
      margin-right: 8px;
    }

    .header-content h1 {
      font-size: 1.25rem !important;
    }

    .terms-content {
      padding: 16px;
      border-radius: 8px;
    }

    .update-info {
      margin-top: 8px;
    }

    .contact-section {
      margin-top: 24px;
    }

    .text-h6 {
      font-size: 1.125rem !important;
      line-height: 1.4 !important;
    }

    .text-body-1 {
      font-size: 0.95rem !important;
      line-height: 1.6 !important;
    }

    .terms-list li {
      padding-left: 20px;
      font-size: 0.95rem;
    }
  }

  @media (max-width: 399px) {
    .terms-container {
      padding: 8px;
      padding-bottom: 80px;
    }

    .page-header {
      padding: 8px 0 16px 0;
    }

    .back-btn {
      margin-right: 6px;
    }

    .header-content h1 {
      font-size: 1.125rem !important;
    }

    .header-content .v-icon {
      font-size: 24px !important;
    }

    .terms-content {
      padding: 12px;
    }
  }

  /* Tablet */
  @media (min-width: 600px) and (max-width: 959px) {
    .terms-container {
      padding: 20px;
      padding-bottom: 80px;
    }

    .page-header {
      padding: 20px 0 28px 0;
    }

    .terms-content {
      padding: 32px;
    }
  }

  /* Desktop */
  @media (min-width: 960px) {
    .terms-container {
      padding: 24px;
      padding-bottom: 80px;
    }

    .page-header {
      padding: 24px 0 32px 0;
    }

    .terms-content {
      padding: 40px;
    }

    .contact-section {
      margin-top: 48px;
    }
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Link hover effects */
  .text-primary:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  /* Section spacing */
  section {
    scroll-margin-top: 80px;
  }

  /* Print styles */
  @media print {
    .page-header {
      display: none !important;
    }

    .terms-page {
      background-color: white !important;
    }

    .terms-content {
      box-shadow: none !important;
      border: 1px solid #ddd;
    }

    .contact-section .v-card {
      border: 1px solid #ddd !important;
      background-color: #f5f5f5 !important;
    }
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .terms-content {
      border: 2px solid #000;
    }

    .terms-list li::before {
      color: #000;
    }
  }

  /* Email link styling */
  .email-link {
    transition: all 0.2s ease;
    border-radius: 4px;
    padding: 4px 8px;
    margin: -4px -8px;
  }

  .email-link:hover {
    background-color: rgba(25, 118, 210, 0.08);
    text-decoration: underline !important;
    transform: scale(1.02);
  }

  .email-link:active {
    transform: scale(0.98);
  }

  /* Focus styles for keyboard navigation */
  .v-btn:focus-visible {
    outline: 2px solid #1976d2;
    outline-offset: 2px;
  }
</style>
