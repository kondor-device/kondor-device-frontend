import { ValuesCheckoutFormType } from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import axios from "axios";
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useCartStore } from "@/store/cartStore";

export const handleSubmitForm = async <T>(
  { resetForm }: FormikHelpers<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setIsCheckoutPopUpShown: Dispatch<SetStateAction<boolean>>,
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
  data: string,
  values: ValuesCheckoutFormType,
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true);

    await axios({
      method: "post",
      url: "/api/telegram",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dataGoogle = {
      name: values.name.trim(),
      surname: values.surname.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      postOffice: values.postOffice.trim(),
      promocode: values.promocode.trim(),
      payment: values.payment.trim(),
    };

    await axios({
      method: "post",
      url: "/api/googlesheet",
      data: dataGoogle,
      headers: {
        "Content-Type": "application/json",
      },
    });

    resetForm();
    const { clearCart } = useCartStore.getState();
    clearCart();

    setIsCheckoutPopUpShown(false)

    if (setIsPopUpShown) {
      setIsPopUpShown(false);
    }
  } catch (error) {
    setIsError(true);
    console.error(error);
    return error;
  } finally {
    setIsLoading(false);
    setIsNotificationShown(true);
  }
};
