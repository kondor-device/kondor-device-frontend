import Modal from "@/components/shared/modal/Modal";
import React, { Dispatch, SetStateAction } from "react";
import CartItemsList from "../cart/cartProducts/CartItemsList";

interface CheckoutPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function CheckoutPopUp({
  isPopUpShown,
  setIsPopUpShown,
}: CheckoutPopUpProps) {
  return (
    <>
      <Modal isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown}>
        <CartItemsList />
      </Modal>
    </>
  );
}
