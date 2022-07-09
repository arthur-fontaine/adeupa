import React from 'react'
import './TextInput.scss'

function TextInput({ name, type, placeholder, value, icon, onChange, onBlur, onFocus }: {
  name: string
  type: string
  placeholder: string
  value: string,
  icon?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
}) {
  const [focused, setFocused] = React.useState(false)

  return (
    <div className='text-input' data-focused={focused}>
      {icon && <i className={`ri-${icon}-line`}></i>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setFocused(false)
          onBlur && onBlur(e)
        }}
        onFocus={(e) => {
          setFocused(true)
          onFocus && onFocus(e)
        }}
      />
    </div>
  )
}

export default TextInput
