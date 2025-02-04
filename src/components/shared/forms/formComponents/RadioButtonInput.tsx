import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React from "react";

interface Values {
  [fieldName: string]: string;
}

interface CustomizedInputProps {
  fieldName: string;
  label: string;
  value: string;
  required: boolean;
  placeholder: string;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  fieldClassName?: string;
}

const labelStyles =
  "relative cursor-pointer flex items-center gap-x-2 text-inputText text-xs";
const fieldStyles =
  "relative cursor-pointer appearance-none w-5 h-5 rounded-full placeholder-inputText outline-none text-sm transition duration-300 ease-out";
const errorStyles = "absolute bottom-[-19px] right-0 text-xxs text-inputError";

export default function RadioButtonInput({
  errors,
  touched,
  fieldName,
  label = "",
  value = "",
  required = false,
  placeholder = "",
  fieldClassName = "",
}: CustomizedInputProps) {
  return (
    <label className={labelStyles}>
      <Field
        name={fieldName}
        type="radio"
        value={value}
        autoComplete="on"
        placeholder={placeholder}
        className={`${fieldStyles} ${fieldClassName} ${
          errors[fieldName] && touched[fieldName]
            ? "border-inputErrorLight"
            : "shadow-radio border-[5px] border-white bg-white checked:bg-blue"
        }`}
      ></Field>
      <p>
        {label}
        {required && <span className="text-inputError"> *</span>}
      </p>

      <ErrorMessage
        name={fieldName}
        component="p"
        className={errorStyles}
      ></ErrorMessage>
    </label>
  );
}
