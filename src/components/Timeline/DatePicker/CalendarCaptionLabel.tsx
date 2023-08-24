import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../Elements/Select'
import { de } from 'date-fns/locale'
import { useNavigation } from 'react-day-picker'

export default function CalendarCaptionLabel({ month }: { month: Date }) {
  const { goToMonth } = useNavigation()

  return (
    <div className="flex items-center gap-1">
      <Select
        onValueChange={value => {
          const newDate = new Date(month)
          newDate.setMonth(Number(value))
          goToMonth(newDate)
        }}
        value={month.getMonth().toString()}
      >
        <SelectTrigger className="w-[110px] text-sm">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 })
            .map((_e, i) =>
              format(new Date(2000, i, 1), 'MMMM', { locale: de }),
            )
            .map((month, idx) => (
              <SelectItem className="text-sm" key={idx} value={idx.toString()}>
                {month}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <input
        className="border-input my-0 block h-10 w-[4rem] items-center rounded-md border px-2 py-2 text-sm [appearance:textfield] placeholder:text-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={e => {
          const newDate = new Date(month)
          newDate.setFullYear(Number(e.target.value))
          goToMonth(newDate)
        }}
        type="number"
        value={month.getFullYear().toString()}
      />
    </div>
  )
}
