import React from "react";
import { useCartStore } from "@/store/cartStore";
import Button from "../../buttons/Button";

interface SubmitButtonProps {
  onClick: () => void | Promise<void>;
  dirty: boolean;
  isValid: boolean;
  isLoading: boolean;
  disabled?: boolean;
  children: string;
  className?: string;
}

export default function SubmitButton({
  onClick,
  dirty,
  isValid,
  isLoading,
  disabled = false,
  children,
  className = "",
}: SubmitButtonProps) {
  const { cartItems, hasOutOfStockItems } = useCartStore();

  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={
        disabled ||
        !(dirty && isValid) ||
        isLoading ||
        !cartItems.length ||
        hasOutOfStockItems()
      }
      isLoading={isLoading}
      className={`${className}`}
    >
      {children}
    </Button>
  );
}
