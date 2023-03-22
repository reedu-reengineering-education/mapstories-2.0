import { StepMarker } from '../types/Stepmarker'

export const splitMarkers = (markers: StepMarker[]) => {
  if (!markers || markers.length === 0) {
    return []
  }

  const groups = []
  let currentGroup = [markers[0]]

  for (let i = 1; i < markers.length; i++) {
    const prevMarker = markers[i - 1]
    const currMarker = markers[i]

    if (currMarker.position === prevMarker.position + 1) {
      currentGroup.push(currMarker)
    } else {
      groups.push(currentGroup)
      currentGroup = [currMarker]
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup)
  }

  return groups
}
