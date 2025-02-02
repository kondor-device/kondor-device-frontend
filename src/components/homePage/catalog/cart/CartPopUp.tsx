"use client";

import React, { Dispatch, SetStateAction } from "react";
import Modal from "@/components/shared/modal/Modal";
import CartItemsList from "./CartItemsList";

interface CartPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function CartPopUp({
  isPopUpShown,
  setIsPopUpShown,
}: CartPopUpProps) {
  return (
    <>
      <Modal
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
        showCloseButton={false}
      >
        <CartItemsList />
      </Modal>
    </>
  );
}
