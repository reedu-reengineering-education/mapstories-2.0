export type TimePickerProps = React.ComponentPropsWithoutRef<'input'> & {
  time: string
  setTime: (time: string) => void
}

function TimePicker({ time, setTime, ...props }: TimePickerProps) {
  return (
    <input
      className="rounded-md border text-center"
      onChange={e => setTime(e.target.value)}
      type="time"
      value={time}
    />
  )
}

export { TimePicker }
