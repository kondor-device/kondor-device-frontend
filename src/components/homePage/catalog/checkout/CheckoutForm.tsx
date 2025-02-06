"use client";
import { Form, FormikProps } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import MaskedInput from "react-text-mask";
import { PHONE_NUMBER_MASK } from "@/constants/constants";
import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import RadioButtonInput from "@/components/shared/forms/formComponents/RadioButtonInput";
import { ValuesCheckoutFormType } from "./CheckoutPopUp";
import { searchCities } from "@/utils/searchCities";
import { searchWarehouses } from "@/utils/searchWarehouses";

interface City {
  Ref: string;
  Description: string;
}

interface Warehouse {
  SiteKey: string;
  Description: string;
}

interface CheckoutFormProps {
  formik: FormikProps<ValuesCheckoutFormType>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
}

export default function CheckoutForm({ formik }: CheckoutFormProps) {
  const t = useTranslations();

  const [cities, setCities] = useState<City[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [cityRef, setCityRef] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      const result = await searchCities(formik.values.city);
      setCities(result);
    };

    fetchCities();
  }, [formik.values.city]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!cityRef) return;
      const result = await searchWarehouses(cityRef, formik.values.postOffice);
      setWarehouses(result);
    };

    fetchWarehouses();
  }, [formik.values.postOffice, cityRef]);

  return (
    <Form className="flex flex-col laptop:flex-row laptop:flex-wrap laptop:justify-between gap-y-4 w-full">
      <CustomizedInput
        fieldName="name"
        label={t("forms.name")}
        required={true}
        placeholder={t("forms.name")}
        errors={formik.errors}
        touched={formik.touched}
      />
      <CustomizedInput
        fieldName="surname"
        label={t("forms.surname")}
        required={true}
        placeholder={t("forms.surname")}
        errors={formik.errors}
        touched={formik.touched}
      />
      <CustomizedInput
        fieldName="phone"
        label={t("forms.phone")}
        required={true}
        placeholder={t("forms.phone")}
        errors={formik.errors}
        touched={formik.touched}
        as={MaskedInput}
        mask={PHONE_NUMBER_MASK}
      />

      <div className="relative w-full">
        <CustomizedInput
          fieldName="city"
          label={t("forms.city")}
          required
          placeholder={t("forms.city")}
          errors={formik.errors}
          touched={formik.touched}
        />
        {cities.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg max-h-[300px] overflow-auto z-10">
            {cities.map((city) => (
              <li
                key={city.Ref}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  formik.setFieldValue("city", city.Description);
                  setCityRef(city.Ref);
                  setCities([]);
                }}
              >
                {city.Description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative w-full">
        <CustomizedInput
          fieldName="postOffice"
          label={t("forms.postOffice")}
          required
          placeholder={t("forms.postOffice")}
          errors={formik.errors}
          touched={formik.touched}
        />
        {warehouses.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg max-h-[300px] overflow-auto z-10">
            {warehouses.map((warehouse) => (
              <li
                key={warehouse.SiteKey}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  formik.setFieldValue("postOffice", warehouse.Description);
                  setWarehouses([]);
                }}
              >
                {warehouse.Description}
              </li>
            ))}
          </ul>
        )}
      </div>
      <CustomizedInput
        fieldName="promocode"
        label={t("forms.promocode")}
        required={true}
        placeholder={t("forms.promocode")}
        errors={formik.errors}
        touched={formik.touched}
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
          errors={formik.errors}
          touched={formik.touched}
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
          errors={formik.errors}
          touched={formik.touched}
        />
      </div>
    </Form>
  );
}
