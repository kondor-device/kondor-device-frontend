import { IconProps } from "@/types/iconsProps";

export default function IconMinus({ className }: IconProps) {
  return (
    <svg
      width="27"
      height="4"
      viewBox="0 0 27 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="minus"
      className={className}
    >
      <path
        d="M0.643066 2.39836C0.643066 1.60938 1.28266 0.969788 2.07164 0.969788H24.9288C25.7178 0.969788 26.3574 1.60938 26.3574 2.39836C26.3574 3.18734 25.7178 3.82693 24.9288 3.82693H2.07164C1.28266 3.82693 0.643066 3.18734 0.643066 2.39836Z"
        fill="currentColor"
      />
    </svg>
  );
}
