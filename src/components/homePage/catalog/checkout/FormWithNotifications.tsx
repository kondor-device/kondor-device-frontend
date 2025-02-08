"use client";
import { Dispatch, SetStateAction } from "react";
import NotificationPopUp from "@/components/shared/notifications/NotificationPopUp";
import CheckoutForm from "./CheckoutForm";

interface FormWithNotificationsProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  isError: boolean;
  isNotificationShown: boolean;
}

export default function FormWithNotifications({
  isError,
  isNotificationShown,
  setIsError,
  setIsNotificationShown,
}: FormWithNotificationsProps) {
  return (
    <>
      <CheckoutForm />
      <NotificationPopUp
        isNotificationShown={isNotificationShown}
        isError={isError}
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
      />
    </>
  );
}
