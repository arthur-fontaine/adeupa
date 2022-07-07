import './Loading.scss'
import { ReactComponent as LogoWhite } from './../../assets/images/logo/logo-white.svg'
import ElementsLoadedContext from '../../contexts/ElementsLoadedContext'
import { useCallback, useContext } from 'react'

function Loading() {
  const elementsLoadedContext = useContext(ElementsLoadedContext)
  console.log('rendering Loading')

  const loadingPageRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      if (Object.values(elementsLoadedContext).map(v => v[0]).every(Boolean)) {
        console.log('starting transition')
        setTimeout(() => {node.classList.add('disappearing')}, 250)
      }
    }
  }, Object.values(elementsLoadedContext).map(v => v[0]))

  return <div className='loading-page' ref={loadingPageRef}>
    <LogoWhite className='loader' />
    <LogoWhite className='loader loader--ring' />
  </div>
}

export default Loading
