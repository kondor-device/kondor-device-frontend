"use client";

import React, { Dispatch, SetStateAction } from "react";
import Modal from "@/components/shared/modal/Modal";
import CartItemsList from "./CartItemsList";
import { ProductItem } from "@/types/productItem";
import AddonsProductsList from "./AddonsProductsList";

interface CartPopUpProps {
  shownOnAddons: ProductItem[];
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function CartPopUp({
  shownOnAddons,
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
        <AddonsProductsList shownOnAddons={shownOnAddons} />
      </Modal>
    </>
  );
}
