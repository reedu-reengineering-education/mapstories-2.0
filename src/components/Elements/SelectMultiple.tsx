import { Fragment, memo, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { FieldWrapper } from './FieldWrapper'
import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

type Props = {
  label: string
  values: string[]
  defaultValues?: string[]
  onSelect?: (values: string[]) => any
  className?: string
  disabled?: boolean
}

// https://stackoverflow.com/a/16436975
// added generic option there
function arraysEqual<T>(a: T[], b: T[]) {
  if (a === b) {
    return true
  }
  if (a == null || b == null) {
    return false
  }
  if (a.length !== b.length) {
    return false
  }

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

function SelectMultiple({
  label,
  values,
  defaultValues = [],
  onSelect,
  className,
  disabled,
}: Props) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues)

  useEffect(() => {
    if (defaultValues) {
      setSelectedValues(defaultValues)
    }
  }, [defaultValues])

  const onValuesChange = (newValues: string[]) => {
    if (!onSelect || disabled) {
      return
    }
    if (newValues.includes('all') && !selectedValues.includes('all')) {
      if (arraysEqual(values, selectedValues)) {
        setSelectedValues(['all'])
        onSelect(['all'])
      } else {
        setSelectedValues(['all'])
        onSelect(['all'])
      }
    } else {
      setSelectedValues(newValues.filter(v => v !== 'all'))
      onSelect(newValues.filter(v => v !== 'all'))
    }
  }

  return (
    <FieldWrapper className={className} label={label} loading={disabled}>
      <Listbox
        disabled={disabled}
        multiple
        onChange={onValuesChange}
        value={selectedValues}
      >
        <div className={clsx('relative mt-1')}>
          <Listbox.Button className="focus:zinc-blue-500 relative block min-h-[42px] w-full cursor-default appearance-none overflow-hidden rounded border border-zinc-300 pl-2 pr-6 text-left placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none sm:text-sm">
            {selectedValues.length === 0 && (
              <span className="my-2 ml-2 block truncate text-zinc-500">
                Bitte wählen
              </span>
            )}
            {selectedValues.length > 0 && (
              <div className="no-scrollbar mr-2 flex overflow-x-auto">
                {/* sort array without mutation: https://bobbyhadz.com/blog/javascript-sort-array-without-mutating */}
                {[...selectedValues].sort().map((v, i) => (
                  <div
                    className="my-2 mr-2 flex max-w-fit items-center whitespace-nowrap rounded bg-matisse px-2 py-0.5 text-white "
                    key={i}
                  >
                    {v}
                    {selectedValues.includes('all') ? (
                      ''
                    ) : (
                      <XMarkIcon
                        className="ml-2 h-4 w-4 cursor-pointer text-white"
                        onClick={(e: any) => {
                          e.preventDefault()
                          const newValues = selectedValues.filter(
                            sv => sv !== v,
                          )
                          if (newValues.length === 0 || !newValues) {
                            setSelectedValues(['all'])
                            onSelect && onSelect(['all'])
                          } else {
                            setSelectedValues(newValues)
                            onSelect && onSelect(newValues)
                          }
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-2 flex items-center bg-white px-2">
              <ChevronUpDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={clsx(
                'absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                disabled ? 'bg-zinc-100' : 'bg-white',
              )}
            >
              <Listbox.Option
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-zinc-100 text-matisse-900' : 'text-gray-900'
                  }`
                }
                value={'all'}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate text-zinc-500 ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {arraysEqual<string>(selectedValues, values)
                        ? 'Alle abwählen'
                        : 'Alle auswählen'}
                    </span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                      {arraysEqual<string>(selectedValues, values) ? (
                        <MinusIcon aria-hidden="true" className="h-5 w-5" />
                      ) : (
                        <PlusIcon aria-hidden="true" className="h-5 w-5" />
                      )}
                    </span>
                  </>
                )}
              </Listbox.Option>
              {values.map((v, i) => (
                <Listbox.Option
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-zinc-100 text-matisse-900' : 'text-gray-900'
                    }`
                  }
                  key={i}
                  value={v}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {v}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-matisse-600">
                          <CheckIcon aria-hidden="true" className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </FieldWrapper>
  )
}

export default memo(SelectMultiple)
