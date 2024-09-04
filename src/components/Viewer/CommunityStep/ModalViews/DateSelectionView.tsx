import { DatePickerWrapper } from '@/src/components/Timeline/DatePicker/DatePickerWrapper'

export default function DateSelectionView({ date, setDate }: any) {
  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex justify-center">
        <DatePickerWrapper date={date} setDate={setDate} />
      </div>
    </div>
  )
}
