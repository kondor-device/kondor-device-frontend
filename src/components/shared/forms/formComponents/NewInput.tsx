import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React, { ReactNode } from "react";

interface Values {
  [fieldName: string]: string;
}

interface CustomizedInputProps {
  fieldName: string;
  label: string | ReactNode;
  placeholder: string;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  fieldClassName?: string;
}

const labelStyles =
  "relative cursor-pointer flex items-center gap-x-2 text-12semi laptop:text-14semi deskxl:text-18semi";
const fieldStyles =
  "relative cursor-pointer appearance-none size-[14px] rounded-full outline-none transition duration-300 ease-out";
const errorStyles =
  "absolute bottom-[-14px] right-0 text-10med text-inputError";

export default function NewInput({
  errors,
  touched,
  fieldName,
  label = "",
  placeholder = "",
  fieldClassName = "",
}: CustomizedInputProps) {
  return (
    <label className={labelStyles}>
      <Field
        name={fieldName}
        type="text"
        autoComplete="on"
        placeholder={placeholder}
        className={`${fieldStyles} ${fieldClassName} ${
          errors[fieldName] && touched[fieldName]
            ? "border-inputErrorLight"
            : "shadow-radio border-[2.5px] border-white bg-white checked:bg-yellow"
        }`}
      ></Field>
      <p>{label}</p>

      <ErrorMessage
        name={fieldName}
        component="p"
        className={errorStyles}
      ></ErrorMessage>
    </label>
  );
}
