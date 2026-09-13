<template>
  <form
    ref="formElement"
    class="account-edit-form"
    novalidate
    @submit.prevent="submit"
  >
    <p class="account-edit-form__description">
      {{ t('accounts.edit.description') }}
    </p>

    <div v-if="submissionError" class="account-edit-form__error" role="alert">
      {{ submissionError }}
    </div>

    <div class="account-edit-form__fields">
      <BHTextInput
        id="account-edit-name"
        v-model="name"
        name="name"
        autocomplete="off"
        :label="t('accounts.edit.name')"
        :error="fieldErrors.name"
        :disabled="isSubmitting"
        maxlength="100"
        required
      />

      <BHSelect
        id="account-edit-kind"
        v-model="kind"
        name="kind"
        :label="t('accounts.edit.kind')"
        :help="t('accounts.edit.kind_help')"
        :options="kindOptions"
        :error="fieldErrors.kind"
        :disabled="isSubmitting"
        required
      />

      <BHSelect
        id="account-edit-institution"
        v-model="institutionId"
        name="institutionId"
        :label="t('accounts.edit.institution')"
        :placeholder="t('accounts.edit.no_institution')"
        :options="institutionOptions"
        :error="fieldErrors.institutionId"
        :disabled="isSubmitting"
      />
    </div>

    <div class="account-edit-form__actions">
      <BHButton
        type="button"
        variant="secondary"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        {{ t('common.cancel') }}
      </BHButton>
      <BHButton type="submit" :loading="isSubmitting" :disabled="!hasChanges">
        {{ t('accounts.edit.submit') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  ASSET_ACCOUNT_KINDS,
  LIABILITY_ACCOUNT_KINDS,
  isLiabilityAccountKind,
} from '~/constants/account';
import type {
  Account,
  AccountKind,
  UpdateAccountRequest,
} from '~/types/account';
import type { ApiFieldErrorMapping } from '~/composables/useApiFormErrors';
import type { SelectOption } from '~/types/form';
import type { Institution } from '~/types/institution';

interface Props {
  account: Account;
  institutions: Institution[];
}

interface Emits {
  saved: [account: Account];
  cancel: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();
const { update } = useAccountApi();

const formElement = ref<HTMLFormElement | null>(null);
const name = ref(props.account.name);
const kind = ref<AccountKind>(props.account.kind);
const institutionId = ref(props.account.institutionId ?? '');
const isSubmitting = ref(false);
const submissionError = ref('');
const fieldErrors = reactive({
  name: '',
  kind: '',
  institutionId: '',
});

type FieldName = keyof typeof fieldErrors;

const fieldErrorMappings: ReadonlyArray<ApiFieldErrorMapping<FieldName>> = [
  {
    pointer: '#/name',
    codes: ['invalid_length'],
    field: 'name',
    translationKey: 'accounts.edit.error.name_invalid',
  },
  {
    pointer: '#/kind',
    codes: ['invalid_value'],
    field: 'kind',
    translationKey: 'accounts.edit.error.kind_invalid',
  },
  {
    pointer: '#/institutionId',
    codes: ['invalid_institution', 'invalid_value'],
    field: 'institutionId',
    translationKey: 'accounts.edit.error.institution_invalid',
  },
];
const { applyApiFieldErrors, clearFieldErrors, focusFirstInvalidField } =
  useApiFormErrors(fieldErrors, fieldErrorMappings, formElement);

const allowedKinds = computed(() =>
  isLiabilityAccountKind(props.account.kind)
    ? LIABILITY_ACCOUNT_KINDS
    : ASSET_ACCOUNT_KINDS,
);

const kindOptions = computed<SelectOption[]>(() =>
  allowedKinds.value.map((value) => ({
    value,
    label: t(`accounts.kinds.${value}`),
  })),
);

const institutionOptions = computed<SelectOption[]>(() =>
  props.institutions.map(({ id, name: institutionName }) => ({
    value: id,
    label: institutionName,
  })),
);

const hasChanges = computed(
  () =>
    name.value.trim() !== props.account.name ||
    kind.value !== props.account.kind ||
    institutionId.value !== (props.account.institutionId ?? ''),
);

async function submit(): Promise<void> {
  clearErrors();

  if (!validate()) {
    await focusFirstInvalidField();
    return;
  }

  if (!hasChanges.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const account = await update(
      props.account.householdId,
      props.account.id,
      buildRequest(),
    );
    emit('saved', account);
  } catch (cause) {
    if (!applyApiFieldErrors(cause)) {
      submissionError.value = t('accounts.edit.error.generic');
    } else {
      await focusFirstInvalidField();
    }
  } finally {
    isSubmitting.value = false;
  }
}

function validate(): boolean {
  const normalizedName = name.value.trim();

  if (!normalizedName) {
    fieldErrors.name = t('accounts.edit.error.name_required');
  } else if ([...normalizedName].length > 100) {
    fieldErrors.name = t('accounts.edit.error.name_invalid');
  }

  if (!allowedKinds.value.includes(kind.value)) {
    fieldErrors.kind = t('accounts.edit.error.kind_invalid');
  }

  return !Object.values(fieldErrors).some(Boolean);
}

function buildRequest(): UpdateAccountRequest {
  const request: UpdateAccountRequest = {
    name: name.value.trim(),
    kind: kind.value,
  };

  if (institutionId.value) {
    request.institutionId = institutionId.value;
  } else if (props.account.institutionId) {
    request.removeInstitution = true;
  }

  return request;
}

function clearErrors(): void {
  clearFieldErrors();
  submissionError.value = '';
}
</script>

<style lang="css" scoped>
.account-edit-form {
  @apply w-full;
}

.account-edit-form__description {
  @apply mb-5 text-sm leading-6 text-theme-text-secondary;
}

.account-edit-form__error {
  @apply mb-5 rounded-control border border-theme-status-error/40;
  @apply bg-theme-status-error/10 p-3 text-sm text-theme-status-error-strong;
}

.account-edit-form__fields {
  @apply grid gap-4;
}

.account-edit-form__actions {
  @apply mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end;
}

.account-edit-form__actions :deep(.bh-button) {
  @apply w-full sm:w-auto;
}
</style>
