import React from "react";

import Button from "../../buttons/Button";

interface SubmitButtonProps {
  dirty: boolean;
  isValid: boolean;
  isLoading: boolean;
  children: string;
  className?: string;
}

export default function SubmitButton({
  dirty,
  isValid,
  isLoading,
  children,
  className = "",
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={!(dirty && isValid) || isLoading}
      isLoading={isLoading}
      className={`mt-4 tab:mt-6 mr-auto ${className}`}
    >
      {children}
    </Button>
  );
}
