export default function useValidators() {
    const isEmpty: (fieldName: string, fieldValue: string) => void = (fieldName, fieldValue) => {
     return !fieldValue ? "必須項目です" : "";
    }
    const minLength: (fieldName: string, fieldValue: string, min: number) => void = (fieldName, fieldValue, min) => {
         return fieldValue.length < min ? `${min}文字以上入力してください` : "";
   }
   return {isEmpty, minLength}
 }
