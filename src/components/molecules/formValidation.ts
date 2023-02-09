import { reactive } from "vue";
import validators from "@/components/molecules/Validators";
const error = reactive({});

export default function formValidation() {
  const { isEmpty, minLength } = validators();

  const validateEmailField: (fieldName: string, fieldValue: string) => void = (
    fieldName,
    fieldValue
  ) => {
    error[fieldName] = !fieldValue ? isEmpty(fieldName, fieldValue) : "";
  };

  const validateNameField: (fieldName: string, fieldValue: string) => void = (
    fieldName,
    fieldValue
  ) => {
    error[fieldName] = !fieldValue ? isEmpty(fieldName, fieldValue) : "";
  };

  const validateUserNameField: (
    fieldName: string,
    fieldValue: string
  ) => void = (fieldName, fieldValue) => {
    error[fieldName] = !fieldValue
      ? isEmpty(fieldName, fieldValue)
      : minLength(fieldName, fieldValue, 6);
  };

  const validatePasswordField: (
    fieldName: string,
    fieldValue: string
  ) => void = (fieldName, fieldValue) => {
    error[fieldName] = !fieldValue
      ? isEmpty(fieldName, fieldValue)
      : minLength(fieldName, fieldValue, 6);
  };

  return {
    error,
    validateEmailField,
    validateNameField,
    validateUserNameField,
    validatePasswordField,
  };
}
