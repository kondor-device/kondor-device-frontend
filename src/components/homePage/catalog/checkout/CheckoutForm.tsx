"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { throttle } from "lodash";
import { useTranslations } from "next-intl";
import { useState, useCallback, Dispatch, SetStateAction } from "react";
import MaskedInput from "react-text-mask";
import { PHONE_NUMBER_MASK } from "@/constants/constants";
import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import RadioButtonInput from "@/components/shared/forms/formComponents/RadioButtonInput";
import { ValuesCheckoutFormType } from "./CheckoutPopUp";
import { searchCities } from "@/utils/searchCities";
import { searchWarehouses } from "@/utils/searchWarehouses";
import LocationInput from "@/components/shared/forms/formComponents/LocationInput";
import SubmitButton from "@/components/shared/forms/formComponents/SubmitButton";
import { handleSubmitForm } from "@/utils/handleSubmitForm";
import { CheckoutValidation } from "@/schemas/checkoutFormValidation";
import { usePopUpStore } from "@/store/popUpStore";

interface City {
  Ref: string;
  Description: string;
}

interface Warehouse {
  SiteKey: string;
  Description: string;
}

interface CheckoutFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
}

export default function CheckoutForm({
  setIsError,

  setIsNotificationShown,
}: CheckoutFormProps) {
  const t = useTranslations();

  const { setIsCheckoutPopUpShown } = usePopUpStore();

  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [cityRef, setCityRef] = useState<string | null>(null);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [isCitiesDropDownOpen, setIsCitiesDropDownOpen] = useState(false);
  const [isWarehousesDropDownOpen, setIsWarehousesDropDownOpen] =
    useState(false);

  const initialValues: ValuesCheckoutFormType = {
    name: "",
    surname: "",
    phone: "",
    city: "",
    postOffice: "",
    promocode: "",
    payment: "Онлайн оплата (Wayforpay)",
  };

  const validationSchema = CheckoutValidation();

  const submitForm = async (
    values: ValuesCheckoutFormType,
    formikHelpers: FormikHelpers<ValuesCheckoutFormType>
  ) => {
    await handleSubmitForm<ValuesCheckoutFormType>(
      formikHelpers,
      setIsLoading,
      setIsError,
      setIsCheckoutPopUpShown,
      setIsNotificationShown,
      values
    );
  };

  const throttledFetchCities = throttle(async (city: string) => {
    setIsLoadingCities(true);
    try {
      const result = await searchCities(city);
      setCities(result);
    } catch (error) {
      console.error("Помилка при пошуку міст:", error);
    } finally {
      setIsLoadingCities(false);
    }
  }, 500);

  const fetchCities = useCallback(
    (city: string) => {
      throttledFetchCities(city);
    },
    [throttledFetchCities]
  );

  const throttledFetchWarehouses = throttle(
    async (cityRef: string, postOffice: string) => {
      if (!cityRef) return;
      setIsLoadingWarehouses(true);
      try {
        const result = await searchWarehouses(cityRef, postOffice);
        setWarehouses(result);
      } catch (error) {
        console.error("Помилка при пошуку відділень:", error);
      } finally {
        setIsLoadingWarehouses(false);
      }
    },
    500
  );

  const fetchWarehouses = useCallback(
    (postoffice: string) => {
      if (!cityRef) return;
      throttledFetchWarehouses(cityRef, postoffice);
    },
    [throttledFetchWarehouses, cityRef]
  );

  // const onCitiesLocationInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   handleChange(e);
  //   setIsCitiesDropDownOpen(true);
  //   fetchCities(e.target.value);
  // };

  // const onWarehousesLocationInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   handleChange(e);
  //   setIsWarehousesDropDownOpen(true);
  //   fetchWarehouses();
  // };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitForm}
    >
      {({
        errors,
        touched,
        dirty,
        isValid,
        values,
        handleChange,
        setFieldValue,
      }) => (
        <Form className="flex flex-col laptop:flex-row laptop:flex-wrap laptop:justify-between gap-y-4 w-full">
          <CustomizedInput
            fieldName="name"
            label={t("forms.name")}
            required={true}
            placeholder={t("forms.name")}
            errors={errors}
            touched={touched}
            labelClassName="laptop:w-[49%] deskxl:w-[31.5%]"
          />
          <CustomizedInput
            fieldName="surname"
            label={t("forms.surname")}
            required={true}
            placeholder={t("forms.surname")}
            errors={errors}
            touched={touched}
            labelClassName="laptop:w-[49%] deskxl:w-[31.5%]"
          />
          <CustomizedInput
            fieldName="phone"
            label={t("forms.phone")}
            required={true}
            placeholder={t("forms.phone")}
            errors={errors}
            touched={touched}
            as={MaskedInput}
            mask={PHONE_NUMBER_MASK}
            labelClassName="laptop:w-[49%] deskxl:w-[31.5%]"
          />

          <LocationInput
            fieldName="city"
            label={t("forms.city")}
            placeholder={t("forms.city")}
            options={cities.map((city) => ({
              key: city.Ref,
              description: city.Description,
            }))}
            isLoading={isLoadingCities}
            isDropDownOpen={isCitiesDropDownOpen}
            setIsDropDownOpen={setIsCitiesDropDownOpen}
            onChange={(e) => {
              handleChange(e);
              setIsCitiesDropDownOpen(true);
              fetchCities(values.city);
            }}
            onSelect={(city) => {
              setFieldValue("city", city.description);
              setCityRef(city.key);
              setCities([]);
            }}
          />

          <LocationInput
            fieldName="postOffice"
            label={t("forms.postOffice")}
            placeholder={t("forms.postOffice")}
            options={warehouses.map((wh) => ({
              key: wh.SiteKey,
              description: wh.Description,
            }))}
            isLoading={isLoadingWarehouses}
            isDropDownOpen={isWarehousesDropDownOpen}
            setIsDropDownOpen={setIsWarehousesDropDownOpen}
            onChange={(e) => {
              handleChange(e);
              setIsWarehousesDropDownOpen(true);
              fetchWarehouses(values.postOffice);
            }}
            onSelect={(wh) => {
              setFieldValue("postOffice", wh.description);
              setWarehouses([]);
            }}
          />
          <CustomizedInput
            fieldName="promocode"
            label={t("forms.promocode")}
            required={true}
            placeholder={t("forms.promocode")}
            errors={errors}
            touched={touched}
            labelClassName="laptop:w-[49%] deskxl:w-[31.5%]"
          />

          <div
            role="group"
            aria-labelledby="radio-group"
            className="flex flex-col gap-4 deskxl:gap-[22px] deskxl:mt-6"
          >
            <p
              id="radio-group"
              className="text-inputLabel text-14bold laptop:text-16bold deskxl:text-20bold"
            >
              {t("forms.paymentMethods")}
            </p>
            <RadioButtonInput
              fieldName="payment"
              label={t("forms.online")}
              value="Онлайн оплата (Wayforpay)"
              placeholder={t("forms.online")}
              errors={errors}
              touched={touched}
            />
            <RadioButtonInput
              fieldName="payment"
              label={
                <>
                  <span>{t("forms.postpaid")}</span>
                  <span className="text-yellow">{t("forms.comission")}</span>
                </>
              }
              value="Післяплата Нова пошта"
              placeholder={t("forms.postpaid")}
              errors={errors}
              touched={touched}
            />
          </div>
          <SubmitButton
            className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
            dirty={dirty}
            isValid={isValid}
            isLoading={isLoading}
          >
            {t("buttons.makeOrder")}
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
