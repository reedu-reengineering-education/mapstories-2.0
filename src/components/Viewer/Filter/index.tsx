import { memo, useEffect, useState } from 'react'
import SelectMultiple from '@/src/components/Elements/SelectMultiple'

type FilterProps<T = { [k: string]: string[] }> = {
  labels: { [K in keyof T]: string }
  availableValues: T
  defaultValues?: { [K in keyof T]: string[] }
  onChange: (values: T) => void
  disabled?: boolean
}

function Filter<T extends { [k: string]: string[] }>({
  labels,
  availableValues,
  defaultValues,
  onChange,
  disabled,
}: FilterProps<T>) {
  const [values, setValues] = useState<T>(
    // @ts-ignore
    defaultValues ||
      Object.fromEntries<string[]>(
        Object.entries(labels).map(([k]) => [k, []]),
      ),
  )

  useEffect(() => {
    // @ts-ignore
    if (defaultValues) {
      // @ts-ignore
      setValues(defaultValues)
    }
  }, [defaultValues])

  return (
    <div className="relative flex flex-col flex-wrap gap-2 sm:flex-row">
      {Object.keys(availableValues).map((e, i) => (
        <SelectMultiple
          className="min-w-[150px] max-w-full"
          defaultValues={defaultValues?.[e]}
          disabled={disabled}
          key={i}
          label={labels[e]}
          onSelect={v => {
            const newValues = {
              ...values,
              [e]: v,
            }
            setValues(newValues)
            onChange(newValues)
          }}
          values={availableValues[e].sort()}
        />
      ))}
    </div>
  )
}

export default memo(Filter)
