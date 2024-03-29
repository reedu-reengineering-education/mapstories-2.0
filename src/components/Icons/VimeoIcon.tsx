import * as React from 'react'
import { IconProps } from '@/src/types/Icon'

const SvgVimeoIcon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    return (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="#1AB7EB">
          <path d="m418 185c-19 109-128 202-161 223-32 21-62-9-73-30-12-26-49-164-59-176-9-12-39 12-39 12l-13-19s59-71 104-79c47-10 47 73 59 118 11 45 18 70 27 70 10 0 29-24 49-63 21-37-1-71-41-47 17-95 166-118 147-9z" />
        </g>{' '}
      </svg>
    )
  },
)
export default SvgVimeoIcon
