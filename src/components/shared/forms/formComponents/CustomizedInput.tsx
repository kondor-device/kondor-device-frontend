import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React from "react";
import MaskedInput from "react-text-mask";
import { useFormikContext } from "formik";
import Image from "next/image";

interface Values {
  [fieldName: string]: string;
}

interface CustomizedInputProps {
  fieldName: string;
  label: string;
  required: boolean;
  placeholder: string;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  as?: string | typeof MaskedInput;
  labelClassName?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
  mask?: string | RegExp | (string | RegExp)[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const labelStyles = "relative flex flex-col w-full";
const fieldStyles =
  "relative w-full h-full px-[18px] py-[14px] deskxl:py-[19px] text-dark placeholder-grey border rounded-full outline-none text-12med laptop:text-14med deskxl:text-18med transition duration-300 ease-out";
const fieldWrapperStyles =
  "relative group before:content-[''] before:absolute before:top-0 before:left-0 before:rounded-full before:w-full before:h-full before:blur-[3px] before:transition before:duration-300 before:ease-out before:will-change-transform";
const errorStyles = "absolute bottom-[-14px] left-2 text-10med text-inputError";

export default function CustomizedInput({
  errors,
  touched,
  fieldName,
  placeholder = "",
  as,
  labelClassName = "",
  wrapperClassName = "",
  fieldClassName = "",
  mask = "",
  onChange,
  isLoading = false,
}: CustomizedInputProps) {
  const { handleChange } = useFormikContext();

  return (
    <label className={`${labelStyles} ${labelClassName}`}>
      <div
        className={`${fieldWrapperStyles} ${wrapperClassName} ${
          errors[fieldName] && touched[fieldName]
            ? "before:bg-inputError"
            : "before:bg-transparent group-hover:before:bg-yellow focus-within:before:bg-yellow"
        }`}
      >
        <Field
          as={as}
          mask={mask}
          name={fieldName}
          type="text"
          autoComplete="on"
          placeholder={placeholder}
          onChange={onChange || handleChange}
          className={`${fieldStyles} ${fieldClassName} ${
            errors[fieldName] && touched[fieldName]
              ? "border-inputErrorLight"
              : "border-grey focus:border-yellow focus:border-opacity-50"
          }`}
        ></Field>
        {isLoading && (
          <Image
            src="/images/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="size-5 animate-rotation absolute right-3 deskxl:right-5 top-[14px] deskxl:top-[22px]"
          />
        )}
      </div>
      <ErrorMessage
        name={fieldName}
        component="p"
        className={errorStyles}
      ></ErrorMessage>
    </label>
  );
}
