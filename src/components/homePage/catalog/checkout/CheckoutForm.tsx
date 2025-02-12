"use client";
import { Form, FormikProps } from "formik";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState, useCallback } from "react";
import MaskedInput from "react-text-mask";
import { PHONE_NUMBER_MASK } from "@/constants/constants";
import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import RadioButtonInput from "@/components/shared/forms/formComponents/RadioButtonInput";
import { ValuesCheckoutFormType } from "./CheckoutPopUp";
import { searchCities } from "@/utils/searchCities";
import { searchWarehouses } from "@/utils/searchWarehouses";
import LocationInput from "@/components/shared/forms/formComponents/LocationInput";
import TextButton from "@/components/shared/buttons/TextButton";
import { getPromocode } from "@/utils/getPromocode";
import { GET_PROMOCODE_BY_CODE } from "@/lib/datoCmsQueries";
import { useCartStore } from "@/store/cartStore";

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

  const { promocode, applyPromocode, removePromocode } = useCartStore();

  const [cities, setCities] = useState<City[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [cityRef, setCityRef] = useState<string | null>(null);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [isLoadingPromocode, setIsLoadingPromocode] = useState(false);
  const [isCitiesDropDownOpen, setIsCitiesDropDownOpen] = useState(false);
  const [isWarehousesDropDownOpen, setIsWarehousesDropDownOpen] =
    useState(false);

  const throttledFetchCities = debounce(async (city: string) => {
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

  const throttledFetchWarehouses = debounce(
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
    [cityRef, throttledFetchWarehouses]
  );

  const onCitiesLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    formik.handleChange(e);
    fetchCities(e.target.value);
    setIsCitiesDropDownOpen(true);
  };

  const onWarehousesLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    formik.handleChange(e);
    fetchWarehouses(e.target.value);
    setIsWarehousesDropDownOpen(true);
  };

  const verifyPromo = async () => {
    try {
      setIsLoadingPromocode(true);
      const promocode = await getPromocode(
        GET_PROMOCODE_BY_CODE,
        formik.values.promocode
      );
      if (promocode?.data?.allPromocodes?.length > 0) {
        const discount = promocode.data.allPromocodes[0].discount;
        applyPromocode(formik.values.promocode, discount);
      } else {
        formik.setFieldError("promocode", t("forms.errors.noPromocode"));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLoadingPromocode(false);
    }
  };

  const removePromo = async () => {
    removePromocode();
    formik.setFieldValue("promocode", "");
  };

  return (
    <Form className="flex flex-col laptop:flex-row laptop:flex-wrap laptop:justify-between gap-y-4 w-full">
      <CustomizedInput
        fieldName="name"
        label={t("forms.name")}
        required={true}
        placeholder={t("forms.name")}
        errors={formik.errors}
        touched={formik.touched}
        labelClassName="laptop:w-[49%] deskxl:w-[31.5%]"
      />
      <CustomizedInput
        fieldName="surname"
        label={t("forms.surname")}
        required={true}
        placeholder={t("forms.surname")}
        errors={formik.errors}
        touched={formik.touched}
        labelClassName="laptop:w-[49%] deskxl:w-[31.5%]"
      />
      <CustomizedInput
        fieldName="phone"
        label={t("forms.phone")}
        inputType="tel"
        required={true}
        placeholder={t("forms.phone")}
        errors={formik.errors}
        touched={formik.touched}
        as={MaskedInput}
        mask={PHONE_NUMBER_MASK}
        labelClassName="laptop:w-[49%] deskxl:w-[31.5%]"
      />

      <LocationInput
        fieldName="city"
        label={t("forms.city")}
        placeholder={t("forms.city")}
        formik={formik}
        options={cities.map((city) => ({
          key: city.Ref,
          description: city.Description,
        }))}
        isLoading={isLoadingCities}
        isDropDownOpen={isCitiesDropDownOpen}
        setIsDropDownOpen={setIsCitiesDropDownOpen}
        onChange={onCitiesLocationInputChange}
        onSelect={(city) => {
          formik.setFieldValue("city", city.description);
          setCityRef(city.key);
        }}
      />

      <LocationInput
        fieldName="postOffice"
        label={t("forms.postOffice")}
        placeholder={t("forms.postOffice")}
        formik={formik}
        options={warehouses.map((wh) => ({
          key: wh.SiteKey,
          description: wh.Description,
        }))}
        isLoading={isLoadingWarehouses}
        isDropDownOpen={isWarehousesDropDownOpen}
        setIsDropDownOpen={setIsWarehousesDropDownOpen}
        onChange={onWarehousesLocationInputChange}
        onSelect={(wh) => {
          formik.setFieldValue("postOffice", wh.description);
        }}
      />

      <div className="laptop:w-[49%] deskxl:w-[31.5%]">
        <CustomizedInput
          fieldName="promocode"
          label={t("forms.promocode")}
          required={false}
          isLoading={isLoadingPromocode}
          placeholder={t("forms.promocode")}
          errors={formik.errors}
          touched={formik.touched}
        />
        <TextButton
          onClick={promocode ? removePromo : verifyPromo}
          className="block ml-auto mr-2 mt-2 laptop:mt-3"
        >
          {promocode
            ? t("buttons.removePromocode")
            : t("buttons.applyPromocode")}
        </TextButton>
      </div>

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
