import React, { Dispatch, SetStateAction } from "react";
import ModalNotification from "../modal/ModalNotification";
import SuccessfulMessage from "./SuccessfulMessage";
import UnsuccessfulMessage from "./UnsuccessfulMessage";

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
  return (
    <>
      <ModalNotification
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
        setIsError={setIsError}
      >
        <>
          {isError ? (
            <UnsuccessfulMessage />
          ) : (
            <SuccessfulMessage
              setIsNotificationShown={setIsNotificationShown}
            />
          )}
        </>
      </ModalNotification>
    </>
  );
}
