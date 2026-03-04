import { Input } from '@heroui/react'

/** Shared classNames applied to every HeroUI Input in auth forms. */
const INPUT_CLASS_NAMES = {
  inputWrapper:
    'bg-white/5 border-white/10 hover:border-white/20 data-[focus=true]:border-purple-500/60 data-[focus=true]:bg-purple-500/5 transition-all duration-200 rounded-xl h-12',
  input: 'text-white placeholder:text-gray-500 text-sm bg-transparent',
} as const

interface FormInputProps {
  label: string
  type?: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function FormInput({ label, type = 'text', value, onValueChange, placeholder }: FormInputProps) {
  return (
    <div className="input-glass">
      <Input
        placeholder={placeholder ?? label}
        type={type}
        value={value}
        onValueChange={onValueChange}
        variant="bordered"
        isRequired
        classNames={INPUT_CLASS_NAMES}
      />
    </div>
  )
}
