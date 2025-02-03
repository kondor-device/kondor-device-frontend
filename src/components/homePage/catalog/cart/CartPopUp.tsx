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
        <div className="flex flex-col gap-y-[30px] laptop:flex-row">
          <CartItemsList />
          <AddonsProductsList shownOnAddons={shownOnAddons} />
        </div>
        <div className="flex flex-col laptop:flex-row-reverse laptop:justify-between gap-y-5 w-fit mx-auto mt-[30px] laptop:mt-[60px]">
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
