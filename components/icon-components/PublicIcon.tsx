import { IconProps } from './types'

export default function AnonymousIcon({
  size = 16,
  color = '#0025DC',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.3627 7.36325C14.5653 7.64745 14.6667 7.78959 14.6667 7.99992C14.6667 8.21025 14.5653 8.35239 14.3627 8.63659C13.4519 9.91365 11.1261 12.6666 8.00001 12.6666C4.87386 12.6666 2.54808 9.91365 1.63737 8.63659C1.43468 8.35239 1.33334 8.21025 1.33334 7.99992C1.33334 7.78959 1.43468 7.64745 1.63737 7.36325C2.54808 6.08621 4.87386 3.33325 8.00001 3.33325C11.1261 3.33325 13.4519 6.08621 14.3627 7.36325Z"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  )
}
