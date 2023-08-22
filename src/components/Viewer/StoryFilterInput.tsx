import Filter from './Filter'
import { useState } from 'react'

type StoryFilterInputProps = {
  filter: string[]
  onFilterChange: (filter: string[]) => void
  allTags: string[]
}

function removeDuplicates(array: string[]) {
  return array.filter((a, b) => array.indexOf(a) === b)
}

export function StoryFilterInput({
  filter,
  onFilterChange,
  allTags,
}: StoryFilterInputProps) {
  const [values, setValues] = useState<string[]>(removeDuplicates(allTags))

  return (
    <Filter
      availableValues={{ tags: removeDuplicates(allTags) }}
      defaultValues={{ tags: filter }}
      disabled={false}
      labels={{ tags: 'Tags' }}
      onChange={values => {
        if (values.tags.length === 0 && !values) {
          onFilterChange(['all'])
        } else {
          onFilterChange([values.tags.join('-')])
        }
      }}
    />
  )
}
