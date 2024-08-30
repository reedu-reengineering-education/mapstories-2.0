import { Button } from '@/src/components/Elements/Button'
import { DatePickerWrapper } from '@/src/components/Timeline/DatePicker/DatePickerWrapper'

export default function DateSelectionView({
  date,
  setDate,
  onBack,
  onNext,
}: any) {
  return (
    <div className="flex flex-col justify-center gap-4">
      <DatePickerWrapper date={date} setDate={setDate} />
      <div className="flex justify-between">
        <Button onClick={onBack} variant={'inverse'}>
          Zurück
        </Button>
        <Button onClick={onNext}>Weiter</Button>
      </div>
    </div>
  )
}
