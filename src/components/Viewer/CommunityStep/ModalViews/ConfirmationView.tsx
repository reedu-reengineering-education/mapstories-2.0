import { Button } from '@/src/components/Elements/Button'
import StepSuggestionCard from '@/src/components/Studio/Mapstories/StepSuggestions/StepSuggestionCard'

export default function ConfirmationView({
  onBack,
  onConfirm,
  stepSuggestion,
}: any) {
  return (
    <div className="flex flex-col gap-4">
      <div>This is your step are you sure? </div>

      <div className="">
        <StepSuggestionCard stepSuggestion={stepSuggestion} />
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
