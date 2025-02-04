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
        <h3 className="mb-5 laptop:mb-[60px] text-16semi laptop:text-24bold">
          {t("homePage.catalog.checkout")}
        </h3>
        <div className="laptop:flex flex-row-reverse justify-between">
          <CartItemsList />
          <div className="laptop:w-[57%]">
            <h3 className="my-5 laptop:mt-0 laptop:mb-[30px] text-14bold laptop:text-20bold">
              {t("homePage.catalog.yourData")}
            </h3>
          </div>
        </div>
        <div className="flex flex-col laptop:flex-row-reverse laptop:justify-between gap-y-5 w-fit laptop:w-full mx-auto mt-[30px] laptop:mt-12 deskxl:mt-[60px]">
          <Button className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]">
            {t("buttons.makeOrder")}
          </Button>
          <Button
            onClick={() => setIsPopUpShown(false)}
            variant="secondary"
            className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
          >
            {t("buttons.continueShopping")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
