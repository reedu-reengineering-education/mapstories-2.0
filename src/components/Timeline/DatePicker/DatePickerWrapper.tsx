import { useEffect, useState } from 'react'
import { Calendar } from './Calendar'
import { TimePicker } from './TimePicker'

export type DatePickerWrapperProps = React.ComponentPropsWithoutRef<'div'> & {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

function DatePickerWrapper({ children, ...props }: DatePickerWrapperProps) {
  const [day, setDay] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState('10:00')

  useEffect(() => {
    const hours = parseInt(time.split(':')[0])
    const minutes = parseInt(time.split(':')[1])
    if (day) {
      day.setHours(hours)
      day.setMinutes(minutes)
    }
    props.setDate(day)
  }, [day, time])

  return (
    <div className="flex flex-col gap-10">
      <Calendar
        className="rounded-md border"
        mode="single"
        onSelect={setDay}
        selected={day ?? new Date()}
      />
      <TimePicker setTime={setTime} time={time} />
    </div>
  )
}

export { DatePickerWrapper }
