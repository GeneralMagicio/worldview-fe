import { IconProps } from "./types";

export default function CheckIcon({ size = 21, color = "#0025DC" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.3334 10.5C18.3334 5.89758 14.6024 2.16663 10 2.16663C5.39765 2.16663 1.66669 5.89758 1.66669 10.5C1.66669 15.1023 5.39765 18.8333 10 18.8333C14.6024 18.8333 18.3334 15.1023 18.3334 10.5Z"
        stroke={color}
        strokeWidth="1.25"
      />
      <path
        d="M6.66669 10.9167L8.75002 13L13.3334 8"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
