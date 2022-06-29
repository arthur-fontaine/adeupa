type Direction = 'left' | 'right'

const registerSwipeEvent = () => {
  const swipeEventBuilder = (direction: Direction, xDelta: number) => {
    return new CustomEvent<{ direction: Direction, xDelta: number }>('swipe', {
      detail: { direction, xDelta },
      bubbles: true,
    })
  }

  let touchstartX = 0
  let touchendX = 0

  function checkDirection(): Direction {
    if (touchendX < touchstartX) return 'left'
    if (touchendX > touchstartX) return 'right'
    return 'left'
  }

  document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
  })

  document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX

    if (e.target) {
      e.target.dispatchEvent(swipeEventBuilder(checkDirection(), touchendX - touchstartX))
    }
  })
}

export interface SwipeEvent extends Event {
  detail: {
    direction: 'left' | 'right'
    xDelta: number
  }
}

export default registerSwipeEvent
