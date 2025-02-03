"use client";

import React, { Dispatch, SetStateAction } from "react";
import Modal from "@/components/shared/modal/Modal";
import CartItemsList from "./CartItemsList";
import { ProductItem } from "@/types/productItem";
import AddonsProductsList from "./AddonsProductsList";
import Button from "@/components/shared/buttons/Button";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("buttons");

  return (
    <>
      <Modal
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
        showCloseButton={false}
      >
        <CartItemsList />
        <AddonsProductsList shownOnAddons={shownOnAddons} />
        <div className="flex flex-col gap-y-5 mt-[30px]">
          <Button className="w-full max-w-[350px]">{t("next")}</Button>
          <Button
            onClick={() => setIsPopUpShown(false)}
            variant="secondary"
            className="w-full max-w-[350px]"
          >
            {t("continueShopping")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
