"use client";
import { Dispatch, SetStateAction } from "react";
import NotificationPopUp from "@/components/shared/notifications/NotificationPopUp";
import CheckoutForm from "./CheckoutForm";
import { FormikProps } from "formik";
import { ValuesCheckoutFormType } from "./CheckoutPopUp";

interface FormWithNotificationsProps {
  formik: FormikProps<ValuesCheckoutFormType>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  isError: boolean;
  isNotificationShown: boolean;
}

export default function FormWithNotifications({
  formik,
  setIsLoading,
  isError,
  isNotificationShown,
  setIsError,
  setIsNotificationShown,
}: FormWithNotificationsProps) {
 
  return (
    <>
      <CheckoutForm
        formik={formik}
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
        setIsLoading={setIsLoading}
      />
      <NotificationPopUp
        isNotificationShown={isNotificationShown}
        isError={isError}
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
      />
    </>
  );
}
