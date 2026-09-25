"use client";
import React, { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import CartItemsList from "../cart/cartProducts/CartItemsList";
import { useLocale, useTranslations } from "next-intl";
import SubmitButton from "@/components/shared/forms/formComponents/SubmitButton";
import Button from "@/components/shared/buttons/Button";
import { CheckoutValidation } from "@/schemas/checkoutFormValidation";
import FormWithNotifications from "./FormWithNotifications";
import { handleSubmitForm } from "@/utils/handleSubmitForm";
import { useModalStore } from "@/store/modalStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "@/i18n/routing";
import { ProductItem } from "@/types/productItem";
import CartPopUp, { CART_MODAL_STYLES } from "../cart/CartPopUp";
import { useCartAvailabilityCheck } from "@/hooks/useCartAvailabilityCheck";

export interface ValuesCheckoutFormType {
  name: string;
  surname: string;
  phone: string;
  city: string;
  postOffice: string;
  promocode: string;
  payment: string;
}

interface CheckoutPopUpProps {
  shownOnAddonsProducts: ProductItem[];
}

export default function CheckoutPopUp({
  shownOnAddonsProducts,
}: CheckoutPopUpProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  const router = useRouter();
  const locale = useLocale();

  const { closeModal, openModal } = useModalStore();
  const { activeModal } = useModalStore((state) => state);
  const { promocode, hasOutOfStockItems } = useCartStore();

  const isActive = activeModal.name === "checkoutPopUp";
  const { isChecking, availabilityNotice } = useCartAvailabilityCheck(isActive);

  const hasUnavailableItems = hasOutOfStockItems();

  const initialValues: ValuesCheckoutFormType = {
    name: "",
    surname: "",
    phone: "",
    city: "",
    postOffice: "",
    promocode: promocode || "",
    payment: "Онлайн оплата (Wayforpay)",
  };

  const validationSchema = CheckoutValidation();

  const submitForm = async (
    values: ValuesCheckoutFormType,
    formikHelpers: FormikHelpers<ValuesCheckoutFormType>,
  ) => {
    const result = await handleSubmitForm<ValuesCheckoutFormType>(
      formikHelpers,
      setIsLoading,
      setIsError,
      setIsNotificationShown,
      values,
      router,
      locale,
    );

    if (result.success === false && result.reason === "out_of_stock") {
      closeModal();
      openModal(
        "cartPopUp",
        <CartPopUp shownOnAddonsProducts={shownOnAddonsProducts} />,
        CART_MODAL_STYLES,
      );
      const modalContainer = document.getElementById("modal");
      if (modalContainer) {
        modalContainer.scrollTop = 0;
      }
      return;
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="block">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitForm}
      >
        {(formik) => (
          <>
            <h3 className="mb-5 laptop:mb-[30px] deskxl:mb-[60px] text-16semi laptop:text-20bold deskxl:text-24bold">
              {t("homePage.catalog.checkout")}
            </h3>
            <div className="laptop:flex flex-row-reverse justify-between">
              <CartItemsList
                isChecking={isChecking}
                removedItemsCount={availabilityNotice?.removedCount ?? 0}
              />
              <div className="laptop:w-[57%] laptop:my-auto">
                <h3 className="my-5 laptop:mt-0 laptop:mb-5 mb-[30px] text-14bold laptop:text-16bold deskxl:text-20bold">
                  {t("homePage.catalog.yourData")}
                </h3>
                <FormWithNotifications
                  formik={formik}
                  isError={isError}
                  isNotificationShown={isNotificationShown}
                  setIsLoading={setIsLoading}
                  setIsError={setIsError}
                  setIsNotificationShown={setIsNotificationShown}
                />
              </div>
            </div>
            <div className="flex flex-col laptop:flex-row-reverse items-center laptop:justify-between laptop:items-center gap-y-5 w-full mx-auto mt-[30px] laptop:mt-12 deskxl:mt-[60px]">
              <SubmitButton
                className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
                onClick={formik.submitForm}
                dirty={formik.dirty}
                isValid={formik.isValid}
                isLoading={isLoading}
                disabled={isChecking || hasUnavailableItems}
              >
                {t("buttons.makeOrder")}
              </SubmitButton>
              <Button
                onClick={() => closeModal()}
                variant="secondary"
                className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
              >
                {t("buttons.continueShopping")}
              </Button>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}
