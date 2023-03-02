import { computed, type ComputedRef } from "vue";

export default function SubmitButtonState(
  user: any,
  errors: any
): {
  isSignupButtonDisabled: ComputedRef<boolean>;
} {
  const isSignupButtonDisabled = computed(() => {
    let disabled: boolean = true;
    for (const prop in user) {
      if (prop == "profile") {
        continue;
      }
      if (!user[prop] || errors[prop]) {
        disabled = true;
        break;
      }
      disabled = false;
    }
    return disabled;
  });
  return { isSignupButtonDisabled };
}
