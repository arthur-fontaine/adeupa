import './style.scss'

function TextInput({
  name,
  type,
  placeholder,
  value,
  onChange,
}: {
  name: string
  type: string
  placeholder: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <div /* className="text-input" */>
      <input className="container__form__text-input"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default TextInput
