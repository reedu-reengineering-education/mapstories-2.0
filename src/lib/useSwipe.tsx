import { TouchEvent, useState } from 'react'

interface SwipeInput {
  onSwipedLeft: () => void
  onSwipedRight: () => void
}

interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
}

export default (input: SwipeInput): SwipeOutput => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })

  const minSwipeDistance = 50

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd({ x: 0, y: 0 }) // otherwise the swipe is fired even with usual touch events
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) {
      return
    }
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = Math.abs(touchStart.y - touchEnd.y)
    
    // Nur horizontale Swipes erkennen, wenn horizontale Bewegung größer als vertikale ist
    if (Math.abs(distanceX) <= distanceY) {
      return // Primär vertikale Bewegung - ignorieren
    }
    
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    
    if (isLeftSwipe) {
      input.onSwipedLeft()
    }
    if (isRightSwipe) {
      input.onSwipedRight()
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
