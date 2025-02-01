import { IconProps } from "@/types/iconsProps";

export default function IconClose({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="icon close"
      className={className}
    >
      <g clip-path="url(#clip0_2065_191)">
        <path
          d="M22.5 11.2432H13.5V2.24316C13.5 1.41474 12.8284 0.743164 12 0.743164C11.1716 0.743164 10.5 1.41474 10.5 2.24316V11.2432H1.5C0.671578 11.2432 0 11.9147 0 12.7432C0 13.5716 0.671578 14.2432 1.5 14.2432H10.5V23.2432C10.5 24.0716 11.1716 24.7432 12 24.7432C12.8284 24.7432 13.5 24.0716 13.5 23.2432V14.2432H22.5C23.3284 14.2432 24 13.5716 24 12.7432C24 11.9147 23.3284 11.2432 22.5 11.2432Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2065_191">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.743164)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
