import React, { forwardRef, InputHTMLAttributes } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    onChange,
    value = '',
    classNameInput = 'w-full  rounded-sm border  border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = React.useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (/^\d+$/.test(value) || value === '') {
      onChange && onChange(event)
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input ref={ref} className={classNameInput} value={value || localValue} onChange={handleChange} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
