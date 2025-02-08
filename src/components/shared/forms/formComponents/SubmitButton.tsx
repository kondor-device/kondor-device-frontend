import React from "react";
import { useCartStore } from "@/store/cartStore";
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
  const { cartItems } = useCartStore();

  return (
    <Button
      type="submit"
      disabled={!(dirty && isValid) || isLoading || !cartItems.length}
      isLoading={isLoading}
      className={`${className}`}
    >
      {children}
    </Button>
  );
}
