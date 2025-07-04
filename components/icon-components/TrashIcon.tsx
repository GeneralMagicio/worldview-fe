import { IconProps } from './types'

export default function TrashIcon({ size = 18, color = '#DC0025' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.125 4.125L14.6602 11.6438C14.5414 13.5648 14.4821 14.5253 14.0006 15.2159C13.7625 15.5573 13.456 15.8455 13.1005 16.062C12.3816 16.5 11.4192 16.5 9.49452 16.5C7.56734 16.5 6.60372 16.5 5.88429 16.0612C5.5286 15.8443 5.222 15.5556 4.98401 15.2136C4.50266 14.5219 4.44459 13.5601 4.32846 11.6364L3.875 4.125"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.75 4.125H16.25M12.5418 4.125L12.0298 3.0688C11.6897 2.3672 11.5196 2.01639 11.2263 1.79761C11.1612 1.74908 11.0923 1.7059 11.0203 1.66852C10.6954 1.5 10.3056 1.5 9.52588 1.5C8.7266 1.5 8.327 1.5 7.99676 1.67559C7.92357 1.71451 7.85373 1.75943 7.78797 1.80988C7.49123 2.03753 7.32547 2.40116 6.99396 3.12844L6.53969 4.125"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.625 12.375V7.875"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.375 12.375V7.875"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
