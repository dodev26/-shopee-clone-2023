import React, { InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form'
export interface InputV2Props extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
}
const InputV2 = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: UseControllerProps<TFieldValues, TName> & InputV2Props
) => {
  const {
    type,
    onChange,
    className,
    classNameInput = 'w-full  rounded-sm border  border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    value = '',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [localState, setLocalState] = useState<string>(field.value)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      setLocalState(valueFromInput)
      field.onChange(event)
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} value={value || localState} onChange={handleChange} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

// type Gen<TFunc> = {
//   getName: TFunc
// }
// function Hexa<TFunc extends () => string, TLastName extends ReturnType<TFunc>>(props: {
//   name: Gen<TFunc>
//   lastName: TLastName
// }) {
//   return null
// }
// const handleNzme: () => 'do' = () => 'do'
// function App() {
//   return <Hexa name={{ getName: handleNzme }} lastName={'do'} />
// }
export default InputV2
