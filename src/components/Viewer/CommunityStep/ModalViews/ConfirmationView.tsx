import { Button } from '@/src/components/Elements/Button'
import { Slide } from '../../Slide'

export default function ConfirmationView({
  onBack,
  onConfirm,
  stepSuggestion,
}: any) {
  return (
    <div>
      <div>This is your step are you sure? </div>
      <div>
        <Slide step={stepSuggestion} />
      </div>
      <div className="flex flex-row justify-end gap-4">
        <Button onClick={onBack} variant={'inverse'}>
          Zurück
        </Button>
        <Button onClick={onConfirm}>Bestätigen</Button>
      </div>
    </div>
  )
}
