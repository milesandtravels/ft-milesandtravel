<template>
  <v-alert
    v-if="!isWhatsAppConfigured && showBanner"
    type="info"
    variant="tonal"
    class="whatsapp-banner elevation-2"
    closable
    @click:close="$emit('close')"
  >
    <template #prepend>
      <v-avatar
        size="40"
        color="success"
        class="whatsapp-avatar"
      >
        <v-icon 
          icon="mdi-whatsapp" 
          color="white"
          size="24"
        />
      </v-avatar>
    </template>
    

    
    <div class="banner-content">
      <div class="banner-text">
        <h3 class="text-h6 font-weight-bold mb-2 text-primary">
          Configure o WhatsApp
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Receba notificações dos seus alertas diretamente no WhatsApp. 
          Configure agora e mantenha-se sempre informado.
        </p>
      </div>
      
      <div class="banner-actions">
        <v-btn
          color="success"
          variant="flat"
          size="large"
          prepend-icon="mdi-cog-outline"
          @click="$emit('configure')"
          block
        >
          <span class="text-button font-weight-medium">
            {{ $vuetify.display.xs ? 'Configurar' : 'Configurar Agora' }}
          </span>
        </v-btn>
        
        <v-btn
          variant="text"
          size="small"
          color="medium-emphasis"
          @click="$emit('close')"
          class="dismiss-btn d-none d-sm-flex"
        >
          Dispensar
        </v-btn>
      </div>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
interface Props {
  isWhatsAppConfigured: boolean
  showBanner: boolean
}

interface Emits {
  close: []
  configure: []
}

const props = defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.whatsapp-banner {
  border-radius: 16px !important;
  border: 1px solid rgb(var(--v-theme-success)) !important;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-success), 0.05) 0%, 
    rgba(var(--v-theme-success), 0.02) 100%) !important;
  padding: 20px !important;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.whatsapp-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    rgb(var(--v-theme-success)) 0%, 
    #25D366 100%);
  border-radius: 16px 16px 0 0;
}

.whatsapp-avatar {
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%) !important;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.banner-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: stretch;
  width: 100%;
}

.banner-text {
  flex: 1;
  min-width: 0;
}

.banner-text h3 {
  line-height: 1.3;
  margin-bottom: 8px !important;
}

.banner-text p {
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface-variant));
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

.configure-btn {
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%) !important;
  color: white !important;
  border-radius: 12px !important;
  height: 48px !important;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none !important;
  letter-spacing: 0.5px;
}

.configure-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4) !important;
}

.configure-btn:active {
  transform: translateY(0);
}

.dismiss-btn {
  color: rgb(var(--v-theme-on-surface-variant)) !important;
  text-transform: none !important;
  font-size: 0.875rem;
  height: 36px !important;
}

.close-btn:hover {
  opacity: 1;
}

/* Breakpoints seguindo padrão mobile-first */
@media (min-width: 600px) {
  .whatsapp-banner {
    padding: 24px !important;
  }
  
  .banner-content {
    flex-direction: row;
    align-items: center;
    gap: 32px;
  }
  
  .banner-actions {
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    min-width: 160px;
  }
  
  .configure-btn {
    width: 100%;
    max-width: 180px;
  }
}

@media (min-width: 960px) {
  .whatsapp-banner {
    padding: 28px !important;
  }
  
  .banner-content {
    gap: 40px;
  }
  
  .banner-actions {
    min-width: 180px;
  }
}

/* Animações suaves */
.whatsapp-banner {
  animation: slideInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modo escuro otimizado */
.v-theme--dark .whatsapp-banner {
  border-color: #25D366 !important;
  background: linear-gradient(135deg, 
    rgba(37, 211, 102, 0.08) 0%, 
    rgba(37, 211, 102, 0.03) 100%) !important;
}

.v-theme--dark .banner-text p {
  color: rgba(255, 255, 255, 0.7);
}

/* Acessibilidade */
@media (prefers-reduced-motion: reduce) {
  .whatsapp-banner,
  .configure-btn,
  .close-btn {
    animation: none;
    transition: none;
  }
  
  .configure-btn:hover {
    transform: none;
  }
}

/* Focus states para acessibilidade */
.configure-btn:focus-visible,
.dismiss-btn:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>