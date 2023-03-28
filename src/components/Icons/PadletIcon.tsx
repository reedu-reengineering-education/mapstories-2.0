import * as React from 'react'
import { SVGProps } from 'react'

type PadletIconProps = SVGProps<SVGSVGElement>

const SvgPadletIcon = React.forwardRef<SVGSVGElement, PadletIconProps>(
  (props, ref) => {
    return (
      <svg
        fill="none"
        viewBox="0 0 180 180"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={ref}
      >
        <g clipPath="url(#padlet-icon_svg__a)">
          <path
            clipRule="evenodd"
            d="m86.275 141.017-14.799 3.345a6.33 6.33 0 0 1-7.5-4.506l-9.908-36.277 28.428-66.09c1.427-3.319 6.131-3.319 7.558 0l28.428 66.09-9.907 36.277a6.33 6.33 0 0 1-7.501 4.506l-14.799-3.345Zm0-100.615 2.3 67.857 27.607-4.256-27.606 8.935-2.3 25.739-2.301-25.739-27.606-8.935 27.606 4.256 2.3-67.857Z"
            fill="#FFBC00"
            fillRule="evenodd"
          />
          <mask
            height={110}
            id="padlet-icon_svg__b"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            width={65}
            x={54}
            y={35}
          >
            <path
              clipRule="evenodd"
              d="m86.275 141.017-14.799 3.345a6.33 6.33 0 0 1-7.5-4.506l-9.908-36.277 28.428-66.09c1.427-3.319 6.131-3.319 7.558 0l28.428 66.09-9.907 36.277a6.33 6.33 0 0 1-7.501 4.506l-14.799-3.345Zm0-100.615 2.3 67.857 27.607-4.256-27.606 8.935-2.3 25.739-2.301-25.739-27.606-8.935 27.606 4.256 2.3-67.857Z"
              fill="#fff"
              fillRule="evenodd"
            />
          </mask>
          <g
            clipRule="evenodd"
            fillRule="evenodd"
            mask="url(#padlet-icon_svg__b)"
          >
            <path
              d="M86.254 110.431v33.798l22.158 4.914 11.862-46.039-34.02 7.327Z"
              fill="#FF843C"
            />
            <path
              d="M86.252 25.271v85.921l-34.024-8.068 34.024-77.853Z"
              fill="#63DA46"
            />
            <path
              d="m86.422 141.69-.655-30.757-33.307-7.819 11.406 42.933 5.575 1.687 16.981-6.044Z"
              fill="#9466E8"
            />
          </g>
          <path
            clipRule="evenodd"
            d="m56.332 126.978-6.75-23.852 9.05-20.559L25.997 64.56c-2.24-1.237-4.692 1.253-3.42 3.474l33.755 58.945Z"
            fill="#3992DE"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d="m146.8 87.847 10.234 4.868c1.662.79 3.364-1.01 2.482-2.625l-8.901-16.303-3.815 14.06Z"
            fill="#C1BDC1"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d="m113.766 82.589 9.215 20.907-6.81 23.291 33.76-52.967h-15.865l-20.3 8.769Z"
            fill="#FF4081"
            fillRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="padlet-icon_svg__a">
            <path d="M0 0h180v180H0z" fill="#fff" />
          </clipPath>
        </defs>
      </svg>
    )
  },
)
export default SvgPadletIcon
