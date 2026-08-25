export interface PasswordCheck {
  label: string
  valid: boolean
}

export function checkPasswordStrength(password: string): PasswordCheck[] {
  return [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One special character', valid: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]~`]/.test(password) },
  ]
}

export function isPasswordValid(password: string): boolean {
  return checkPasswordStrength(password).every((c) => c.valid)
}