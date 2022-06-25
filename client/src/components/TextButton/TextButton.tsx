import React, { MouseEventHandler } from 'react'
import './TextButton.scss'

function TextButton({ text, onClick }: { text: string; onClick: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button onClick={onClick} className="text-button">{text}</button>
  )
}

export default TextButton
