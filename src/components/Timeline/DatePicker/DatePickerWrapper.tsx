import { useEffect, useState } from 'react'
import { Calendar } from './Calendar'
import { TimePicker } from './TimePicker'

export type DatePickerWrapperProps = React.ComponentPropsWithoutRef<'div'> & {
  date: Date
  setDate: (date: Date) => void
}

function DatePickerWrapper({ setDate, date }: DatePickerWrapperProps) {
  const [day, setDay] = useState<Date>(new Date())
  const [time, setTime] = useState('12:00:00')

  useEffect(() => {
    if (date) {
      setDay(date)
      setTime(date.toLocaleTimeString())
    }
  }, [])

  useEffect(() => {
    const hours = parseInt(time.split(':')[0])
    const minutes = parseInt(time.split(':')[1])
    if (day) {
      day.setHours(hours)
      day.setMinutes(minutes)
    }
    setDate(day)
  }, [day, time])

  return (
    <div className="flex flex-col gap-10">
      <Calendar
        className="rounded-md border"
        mode="single"
        onSelect={date => (date ? setDay(date) : {})}
        selected={day}
      />
      <TimePicker setTime={setTime} time={time} />
    </div>
  )
}

export { DatePickerWrapper }
