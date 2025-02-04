import Modal from "@/components/shared/modal/Modal";
import React, { Dispatch, SetStateAction } from "react";
import CartItemsList from "../cart/cartProducts/CartItemsList";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/buttons/Button";
import CheckoutForm from "./CheckoutForm";

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
      <Modal
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
        className="laptop:max-w-[1100px] laptop:w-[1100px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
      >
        <h3 className="mb-5 laptop:mb-[30px] deskxl:mb-[60px] text-16semi laptop:text-20bold deskxl:text-24bold">
          {t("homePage.catalog.checkout")}
        </h3>
        <div className="laptop:flex flex-row-reverse justify-between">
          <CartItemsList />
          <div className="laptop:w-[57%] laptop:my-auto">
            <h3 className="my-5 laptop:mt-0 laptop:mb-5 mb-[30px] text-14bold laptop:text-16bold deskxl:text-20bold">
              {t("homePage.catalog.yourData")}
            </h3>
            <CheckoutForm />
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
