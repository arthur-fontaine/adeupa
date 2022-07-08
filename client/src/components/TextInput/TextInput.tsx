import React from 'react'
import './TextInput.scss'

function TextInput({ name, type, placeholder, value, onChange, onBlur, onFocus }: {
  name: string
  type: string
  placeholder: string
  value: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
}) {
  return (
    <input className='text-input'
           type={type}
           name={name}
           placeholder={placeholder}
           value={value}
           onChange={onChange}
           onBlur={onBlur}
           onFocus={onFocus}
    />
  )
}

export default TextInput
