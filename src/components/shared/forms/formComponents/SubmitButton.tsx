import React from "react";

import Button from "../../buttons/Button";

interface SubmitButtonProps {
  onClick: () => void | Promise<void>;
  dirty: boolean;
  isValid: boolean;
  isLoading: boolean;
  children: string;
  className?: string;
}

export default function SubmitButton({
  onClick,
  dirty,
  isValid,
  isLoading,
  children,
  className = "",
}: SubmitButtonProps) {
  console.log("dirty", !(dirty && isValid) || isLoading);
  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={!(dirty && isValid) || isLoading}
      isLoading={isLoading}
      className={`mt-4 tab:mt-6 mr-auto ${className}`}
    >
      {children}
    </Button>
  );
}
