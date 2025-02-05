import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import ModalNotification from "../modal/ModalNotification";

interface NotificationPopUpProps {
  isNotificationShown: boolean;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  isError: boolean;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

export default function NotificationPopUp({
  isNotificationShown,
  setIsNotificationShown,
  isError,
  setIsError,
}: NotificationPopUpProps) {
  const t = useTranslations("notifications");

  return (
    <>
      <ModalNotification
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
        setIsError={setIsError}
      >
        <p className="">{t(`${isError ? "unsuccessful" : "successful"}`)}</p>
      </ModalNotification>
    </>
  );
}
