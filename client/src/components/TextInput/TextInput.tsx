import React from 'react'
import './TextInput.scss'

function TextInput({ name, type, placeholder, value, onChange }: {
  name: string
  type: string
  placeholder: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <input className='text-input'
           type={type}
           name={name}
           placeholder={placeholder}
           value={value}
           onChange={onChange}
    />
  )
}

export default TextInput
