import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import Image from "next/image";
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
  image?: string;
  mask?: string | RegExp | (string | RegExp)[];
}

const labelStyles =
  "relative flex flex-col gap-y-1 w-full text-inputLabel text-xs";
const fieldStyles =
  "relative w-full h-full px-3 py-[14px] text-black placeholder-inputText border rounded-[12px] outline-none text-sm bg-white transition duration-300 ease-out";
const fieldWrapperStyles =
  "relative group before:content-[''] before:absolute before:top-0 before:left-0 before:rounded-[12px] before:w-full before:h-full before:blur-[3px] before:transition before:duration-300 before:ease-out before:will-change-transform";
const errorStyles = "absolute bottom-[-19px] right-0 text-xxs text-inputError";

export default function CustomizedInput({
  errors,
  touched,
  fieldName,
  label = "",
  required = false,
  placeholder = "",
  as,
  labelClassName = "",
  wrapperClassName = "",
  fieldClassName = "",
  image,
  mask = "",
}: CustomizedInputProps) {
  return (
    <label className={`${labelStyles} ${labelClassName}`}>
      <p>
        {label}
        {required && <span className="text-inputError"> *</span>}
      </p>
      <div
        className={`${fieldWrapperStyles} ${wrapperClassName} ${
          errors[fieldName] && touched[fieldName]
            ? "before:bg-inputError"
            : "before:bg-transparent group-hover:before:bg-blueLight focus-within:before:bg-blueLight"
        }`}
      >
        {image && (
          <Image
            src={image}
            alt="phone prefix"
            width="57"
            height="22"
            className="absolute top-1/2 left-3 z-10 transform -translate-y-1/2"
          />
        )}
        <Field
          as={as}
          mask={mask}
          name={fieldName}
          type="text"
          autoComplete="on"
          placeholder={placeholder}
          className={`${fieldStyles} ${fieldClassName} ${
            errors[fieldName] && touched[fieldName]
              ? "border-inputErrorLight"
              : "border-inputStroke focus:border-blueLight "
          }`}
        ></Field>
      </div>
      <ErrorMessage
        name={fieldName}
        component="p"
        className={errorStyles}
      ></ErrorMessage>
    </label>
  );
}
