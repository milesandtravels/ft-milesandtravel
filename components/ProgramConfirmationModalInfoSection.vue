<template>
  <div class="program-info-section" :class="sectionClasses">
    <div class="program-card" :class="cardClasses">
      <div class="logo-container" :class="logoClasses">
        <BaseLogoAvatar
          :src="program.logo_url"
          :alt="program.name"
          :size="logoSize"
          :type="'points'"
          class="program-logo"
        />
      </div>

      <div class="program-details">
        <h3 class="program-name" :class="nameClasses">
          {{ program.name }}
        </h3>
        <div class="program-type-badge" :class="badgeClasses">
          <v-icon :size="badgeIconSize" class="mr-1">{{ getProgramTypeIcon(program.type) }}</v-icon>
          <span class="type-text">{{ getProgramTypeName(program.type) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Program, ProgramType } from '~/interfaces/program'
  import { useDisplay } from 'vuetify';

  interface Props {
    program: Program
  }

  defineProps<Props>()

  const { xs, sm } = useDisplay()

  const sectionClasses = computed(() => ({
    'mb-4': xs.value,
    'mb-5': !xs.value
  }))

  const cardClasses = computed(() => ({
    'flex-column text-center': xs.value,
    'flex-row align-center': !xs.value
  }))

  const logoClasses = computed(() => ({
    'mb-3': xs.value,
    'mr-4': !xs.value
  }))

  const logoSize = computed(() => {
    if (xs.value) return 'xl'
    if (sm.value) return 'lg'
    return 'lg'
  })

  const nameClasses = computed(() => ({
    'text-h6': xs.value || sm.value,
    'text-h5': !xs.value && !sm.value
  }))

  const badgeClasses = computed(() => ({
    'justify-center': xs.value,
    'justify-start': !xs.value
  }))

  const badgeIconSize = computed(() => xs.value ? 14 : 16)

  const getProgramTypeName = (type: ProgramType): string => {
    const typeNames = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return typeNames[type] || type
  }

  const getProgramTypeIcon = (type: ProgramType): string => {
    const typeIcons = {
      cashback: 'mdi-cash-multiple',
      points: 'mdi-star-circle',
      miles: 'mdi-airplane',
    }
    return typeIcons[type] || 'mdi-star-circle'
  }

  const getProgramTypeColor = (type: ProgramType): string => {
    const typeColors = {
      cashback: 'success',
      points: 'primary',
      miles: 'info',
    }
    return typeColors[type] || 'primary'
  }
</script>

<style scoped>
  .program-info-section {
    position: relative;
  }

  .program-card {
    display: flex;
    padding: 20px;
    background: linear-gradient(135deg, rgba(var(--v-theme-surface-variant), 0.1) 0%, rgba(var(--v-theme-surface-variant), 0.05) 100%);
    border-radius: 16px;
    border: 1px solid rgba(var(--v-theme-outline), 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .program-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.7) 100%);
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .program-logo {
    border: 2px solid rgba(var(--v-theme-outline), 0.1);
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .program-details {
    flex: 1;
    min-width: 0;
  }

  .program-name {
    font-weight: 700;
    margin-bottom: 8px;
    color: rgba(var(--v-theme-on-surface), 0.95);
    line-height: 1.3;
    word-break: break-word;
  }

  .program-type-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: rgba(var(--v-theme-primary), 0.1);
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .type-text {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Responsividade para mobile */
  @media (max-width: 599px) {
    .program-card {
      padding: 16px;
      border-radius: 12px;
    }

    .program-name {
      font-size: 1.2rem;
      margin-bottom: 12px;
    }

    .program-type-badge {
      padding: 8px 16px;
    }

    .type-text {
      font-size: 0.75rem;
    }
  }

  /* Responsividade para tablet */
  @media (min-width: 600px) and (max-width: 959px) {
    .program-card {
      padding: 18px;
    }

    .program-name {
      font-size: 1.3rem;
    }
  }

  /* Desktop */
  @media (min-width: 960px) {
    .program-card {
      padding: 20px;
    }

    .program-name {
      font-size: 1.4rem;
    }
  }

  /* Estados de hover */
  .program-card:hover {
    border-color: rgba(var(--v-theme-primary), 0.2);
    background: linear-gradient(135deg, rgba(var(--v-theme-surface-variant), 0.15) 0%, rgba(var(--v-theme-surface-variant), 0.08) 100%);
  }

  .program-card:hover .program-logo {
    border-color: rgba(var(--v-theme-primary), 0.2);
    transform: scale(1.02);
  }

  .program-card:hover .program-type-badge {
    background: rgba(var(--v-theme-primary), 0.15);
    border-color: rgba(var(--v-theme-primary), 0.3);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .program-card,
    .program-logo,
    .program-type-badge {
      transition: none;
    }

    .program-card:hover .program-logo {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .program-card {
      background: linear-gradient(135deg, rgba(var(--v-theme-surface-bright), 0.08) 0%, rgba(var(--v-theme-surface-bright), 0.03) 100%);
      border-color: rgba(var(--v-theme-outline), 0.12);
    }

    .program-card:hover {
      background: linear-gradient(135deg, rgba(var(--v-theme-surface-bright), 0.12) 0%, rgba(var(--v-theme-surface-bright), 0.06) 100%);
    }
  }
</style>
