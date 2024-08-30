import { Button } from '@/src/components/Elements/Button'
import MiniMap from '../MiniMap/MiniMap'

export default function LocationSelectionView({
  handleAddLocation,
  onBack,
  onNext,
}: any) {
  return (
    <div className="flex flex-col justify-end gap-4">
      Setze einen Marker auf der Karte oder gebe die Addresse in der Suchleiste
      ein.
      <div className="h-56 w-96">
        <MiniMap handleAddLocation={handleAddLocation} />
      </div>
      <div className="flex flex-row justify-between gap-4">
        <Button onClick={onBack} variant={'inverse'}>
          Zurück
        </Button>
        <Button onClick={onNext}>Weiter</Button>
      </div>
    </div>
  )
}
