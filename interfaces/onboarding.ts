export interface OnboardingStep {
  id: string
  title: string
  description: string
  target?: string
  icon: string
  animation: { icon: string; color: string }
  features: string[]
  tip: string
}

export interface OnboardingProps {
  modelValue: boolean
  autoStart?: boolean
}

export interface OnboardingEmits {
  'update:modelValue': [value: boolean]
  'tour-completed': []
  'tour-skipped': []
}
