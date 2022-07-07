import React from 'react'
import './Tag.scss'

const Tag = ({ name }: { name: string }) => {
  return <div className='tag'>{name}</div>
}

export default Tag
