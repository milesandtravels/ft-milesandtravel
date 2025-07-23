<template>
  <Teleport to="body" v-if="mounted">
    <Transition name="loading-fade">
      <div
        v-show="loadingStore.isLoading"
        class="universal-loading-overlay"
        @click.stop
        @scroll.prevent
      >
        <div class="loading-container">
          <div class="loading-card">
            <!-- Spinner animado -->
            <div class="spinner-container">
              <div class="loading-spinner"></div>
            </div>

            <!-- Texto de carregamento -->
            <div class="loading-text-container">
              <h3 class="loading-title">{{ loadingStore.loadingText }}</h3>

              <!-- Barra de progresso opcional -->
              <div v-if="loadingStore.showProgress" class="progress-container">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${loadingStore.loadingProgress}%` }"
                  ></div>
                </div>
                <span class="progress-text">
                  {{ Math.round(loadingStore.loadingProgress) }}%
                </span>
              </div>
            </div>

            <!-- Dots animados -->
            <div class="loading-dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { useLoadingStore } from '~/store/loading'

  const loadingStore = useLoadingStore()
  const mounted = ref(false)

  onMounted(() => {
    mounted.value = true
  })

  // Previne scroll quando loading está ativo
  watch(
    () => loadingStore.isLoading,
    isLoading => {
      if (process.client) {
        if (isLoading) {
          document.body.style.overflow = 'hidden'
          document.documentElement.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = ''
          document.documentElement.style.overflow = ''
        }
      }
    }
  )
</script>

<style scoped>
  .universal-loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 400px;
  }

  .loading-card {
    background: white;
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px 32px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
    width: 100%;
    max-width: 350px;
    position: relative;
  }

  .spinner-container {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
  }

  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0f2b46;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text-container {
    margin-bottom: 24px;
  }

  .loading-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
    line-height: 1.4;
  }

  .progress-container {
    margin-top: 16px;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #0f2b46, #1a3a5c);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #666;
    font-weight: 500;
  }

  .loading-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #999;
    animation: bounce 1.4s infinite ease-in-out;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  .dot:nth-child(3) {
    animation-delay: 0s;
  }

  /* Dark theme */
  @media (prefers-color-scheme: dark) {
    .loading-card {
      background: #2d2d2d;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .loading-title {
      color: #fff;
    }

    .progress-text {
      color: #ccc;
    }

    .dot {
      background: #ccc;
    }

    .progress-bar {
      background: #404040;
    }
  }

  /* Animations */
  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: all 0.3s ease;
  }

  .loading-fade-enter-from,
  .loading-fade-leave-to {
    opacity: 0;
  }

  .loading-fade-enter-to,
  .loading-fade-leave-from {
    opacity: 1;
  }

  .loading-fade-enter-from .loading-card,
  .loading-fade-leave-to .loading-card {
    transform: scale(0.9) translateY(20px);
  }

  .loading-fade-enter-to .loading-card,
  .loading-fade-leave-from .loading-card {
    transform: scale(1) translateY(0);
  }

  .loading-card {
    transition: transform 0.3s ease;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 600px) {
    .loading-card {
      padding: 32px 24px;
      margin: 16px;
    }

    .loading-title {
      font-size: 1rem;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
    }
  }
</style>
