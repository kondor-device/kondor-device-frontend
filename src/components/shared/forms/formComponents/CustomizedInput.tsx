import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React from "react";
import MaskedInput from "react-text-mask";

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
  showPhonePrefix?: boolean;
  mask?: string | RegExp | (string | RegExp)[];
}

const labelStyles = "relative flex flex-col w-full laptop:w-[49%]";
const fieldStyles =
  "relative w-full h-full pr-[18px] py-[14px] text-dark placeholder-grey border rounded-full outline-none text-12med laptop:text-14med deskxl:text-18med transition duration-300 ease-out";
const fieldWrapperStyles =
  "relative group before:content-[''] before:absolute before:top-0 before:left-0 before:rounded-full before:w-full before:h-full before:blur-[3px] before:transition before:duration-300 before:ease-out before:will-change-transform";
const errorStyles =
  "absolute bottom-[-14px] right-0 text-10med text-inputError";

export default function CustomizedInput({
  errors,
  touched,
  fieldName,
  placeholder = "",
  as,
  labelClassName = "",
  wrapperClassName = "",
  fieldClassName = "",
  showPhonePrefix = false,
  mask = "",
}: CustomizedInputProps) {
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
          className={`peer ${
            showPhonePrefix
              ? "pl-[42px] laptop:pl-[46px] placeholder-shown:pl-[18px]"
              : "px-[18px]"
          } ${fieldStyles} ${fieldClassName} ${
            errors[fieldName] && touched[fieldName]
              ? "border-inputErrorLight"
              : "border-grey focus:border-yellow focus:border-opacity-50"
          }`}
        ></Field>
        {showPhonePrefix && (
          <span className="peer-placeholder-shown:hidden block absolute top-[23px] left-[18px] z-10 transform -translate-y-1/2 text-[12px] laptop:text-[14px] deskxl:text-[18px] font-medium leading-none">
            +38
          </span>
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
