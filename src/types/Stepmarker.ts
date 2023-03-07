import { MarkerProps } from 'react-map-gl'

export interface StepMarker extends MarkerProps {
  stepId: string
  position: number
  title: string
}
