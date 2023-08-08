'use client'

import { cx as cn } from 'class-variance-authority'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { buttonStyle } from '../../Elements/Button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div>
      <DayPicker
        className={cn('p-3', className)}
        classNames={{
          months:
            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: cn(
            buttonStyle({ variant: 'inverse' }),
            'h-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-none',
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell: 'text-zinc-600 rounded-md w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            buttonStyle({ variant: 'inverse' }),
            'h-9 w-9 p-0 font-normal aria-selected:opacity-100 border-none',
          ),
          day_selected:
            '!bg-primary !text-white hover:bg-primary-light hover:text-primary focus:bg-primary focus:text-primary',
          day_today: 'bg-zinc-100 text-zinc-500',
          day_outside: 'text-zinc-500 opacity-50',
          day_disabled: 'text-zinc-500 opacity-50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-zinc-500',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
        }}
        showOutsideDays={showOutsideDays}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
