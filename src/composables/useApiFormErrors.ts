import type { Ref } from 'vue';

import { ApiError } from '~/types/api';

export interface ApiFieldErrorMapping<FieldName extends string> {
  pointer: string;
  codes: readonly string[];
  field: FieldName;
  translationKey: string;
}

export function useApiFormErrors<FieldName extends string>(
  fieldErrors: Record<FieldName, string>,
  fieldErrorMappings: readonly ApiFieldErrorMapping<FieldName>[],
  formElement: Ref<HTMLFormElement | null>,
) {
  const { t } = useI18n();

  function clearFieldErrors(): void {
    for (const field of Object.keys(fieldErrors) as FieldName[]) {
      fieldErrors[field] = '';
    }
  }

  function applyApiFieldErrors(cause: unknown): boolean {
    if (!(cause instanceof ApiError) || cause.code !== 'validation_error') {
      return false;
    }

    let applied = false;

    for (const error of cause.errors ?? []) {
      if (error.location !== 'body') {
        continue;
      }

      const mapping = fieldErrorMappings.find(
        ({ pointer, codes }) =>
          pointer === error.pointer && codes.includes(error.code),
      );

      if (!mapping) {
        continue;
      }

      fieldErrors[mapping.field] = t(mapping.translationKey);
      applied = true;
    }

    return applied;
  }

  async function focusFirstInvalidField(): Promise<void> {
    await nextTick();
    formElement.value
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }

  return {
    applyApiFieldErrors,
    clearFieldErrors,
    focusFirstInvalidField,
  };
}
