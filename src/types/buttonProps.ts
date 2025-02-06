import { Dispatch, SetStateAction } from "react";

export interface ButtonProps {
  children: string | React.JSX.Element;
  ariaLabel?: string;
  className?: string;
  type?: "submit" | "button";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void | Dispatch<SetStateAction<boolean>> | Promise<void>;
}
