import Modal from "@/components/shared/modal/Modal";
import React, { Dispatch, SetStateAction } from "react";
import CartItemsList from "../cart/cartProducts/CartItemsList";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/buttons/Button";

interface CheckoutPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function CheckoutPopUp({
  isPopUpShown,
  setIsPopUpShown,
}: CheckoutPopUpProps) {
  const t = useTranslations();

  return (
    <>
      <Modal isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown}>
        <h3 className="mb-5 text-16semi">{t("homePage.catalog.checkout")}</h3>
        <CartItemsList />
        <h3 className="mb-5 text-14bold">{t("homePage.catalog.yourData")}</h3>
        <div className="flex flex-col laptop:flex-row-reverse laptop:justify-between gap-y-5 w-fit laptop:w-full mx-auto mt-[30px] laptop:mt-12 deskxl:mt-[60px]">
          <Button>{t("buttons.makeOrder")}</Button>
          <Button
            onClick={() => setIsPopUpShown(false)}
            variant="secondary"
            className="w-full max-w-[350px] laptop:max-w-[320px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
          >
            {t("buttons.continueShopping")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
