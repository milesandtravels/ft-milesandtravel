// composables/useValidators.ts
export const useValidators = () => {
  const passwordRules = [
    (v: string) => !!v || 'Senha é obrigatória',
    (v: string) => v.length >= 8 || 'Senha deve ter pelo menos 8 caracteres',
    (v: string) =>
      /(?=.*[a-z])/.test(v) ||
      'Senha deve conter pelo menos uma letra minúscula',
    (v: string) =>
      /(?=.*[A-Z])/.test(v) ||
      'Senha deve conter pelo menos uma letra maiúscula',
    (v: string) =>
      /(?=.*\d)/.test(v) || 'Senha deve conter pelo menos um número',
  ]

  const passwordConfirmationRules = (password: string) => [
    (v: string) => !!v || 'Confirmação de senha é obrigatória',
    (v: string) => v === password || 'As senhas não coincidem',
  ]

  const emailRules = [
    (v: string) => !!v || 'Email é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'Email deve ser válido',
  ]

  const nameRules = [
    (v: string) => !!v || 'Nome é obrigatório',
    (v: string) => v.length >= 2 || 'Nome deve ter pelo menos 2 caracteres',
    (v: string) => v.length <= 50 || 'Nome muito longo',
  ]

  return {
    passwordRules,
    passwordConfirmationRules,
    emailRules,
    nameRules,
  }
}
