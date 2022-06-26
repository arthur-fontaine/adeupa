import React from 'react'
import './TextInput.scss'

function TextInput({ name, type, placeholder, value, onChange, onBlur }: {
  name: string
  type: string
  placeholder: string
  value: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}) {
  return (
    <input className='text-input'
           type={type}
           name={name}
           placeholder={placeholder}
           value={value}
           onChange={onChange}
           onBlur={onBlur}
    />
  )
}

export default TextInput
