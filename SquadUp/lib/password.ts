export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordCheck {
  minLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  strength: PasswordStrength
  valid: boolean
}

export function checkPassword(password: string): PasswordCheck {
  const minLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  const isLong = password.length >= 12

  const passedCount = [minLength, hasLetter, hasNumber].filter(Boolean).length

  let strength: PasswordStrength = 'weak'
  if (minLength && hasLetter && hasNumber) {
    strength = isLong || hasSpecial ? 'strong' : 'medium'
  }

  return {
    minLength,
    hasLetter,
    hasNumber,
    strength,
    valid: minLength && hasLetter && hasNumber,
  }
}