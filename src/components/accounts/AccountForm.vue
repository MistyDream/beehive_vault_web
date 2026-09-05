<template>
  <form
    ref="formElement"
    class="account-form"
    novalidate
    @submit.prevent="submit"
  >
    <h1 ref="titleElement" tabindex="-1">
      {{ t('accounts.creation.title') }}
    </h1>
    <p class="account-form__description">
      {{ t('accounts.creation.description') }}
    </p>

    <div v-if="submissionError" class="account-form__error" role="alert">
      {{ submissionError }}
    </div>

    <BHSelect
      id="account-kind"
      v-model="kind"
      name="kind"
      :label="t('accounts.creation.kind')"
      :options="kindOptions"
      :error="fieldErrors.kind"
      :disabled="isSubmitting"
      required
    />

    <BHTextInput
      id="account-name"
      v-model="name"
      name="name"
      autocomplete="off"
      :label="t('accounts.creation.name')"
      :error="fieldErrors.name"
      :disabled="isSubmitting"
      maxlength="100"
      required
    />

    <BHSelect
      id="account-institution"
      v-model="institutionId"
      name="institutionId"
      :label="t('accounts.creation.institution')"
      :placeholder="t('accounts.creation.no_institution')"
      :options="institutionOptions"
      :error="fieldErrors.institutionId"
      :disabled="isSubmitting"
    />

    <div class="account-form__field-grid">
      <BHTextInput
        id="account-initial-balance"
        v-model="initialBalance"
        name="initialBalance"
        inputmode="decimal"
        autocomplete="off"
        :label="balanceLabel"
        :help="t('accounts.creation.balance_help')"
        :error="fieldErrors.initialBalance"
        :suffix="currencySymbol"
        :disabled="isSubmitting"
        required
      />

      <BHDateInput
        id="account-balance-date"
        v-model="balanceDate"
        :label="t('accounts.creation.balance_date')"
        :max="currentDate"
        :error="fieldErrors.balanceDate"
        :disabled="isSubmitting"
      />
    </div>

    <BHTextInput
      id="account-currency"
      :model-value="household.baseCurrency"
      :label="t('accounts.creation.currency')"
      :help="t('accounts.creation.currency_help')"
      readonly
    />

    <div class="account-form__actions">
      <BHButton
        type="button"
        variant="secondary"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        {{ t('common.cancel') }}
      </BHButton>
      <BHButton type="submit" :loading="isSubmitting">
        {{ t('accounts.creation.submit') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ApiError } from '~/types/api';
import type { Account, AccountKind } from '~/types/account';
import type { SelectOption } from '~/types/form';
import type { Household } from '~/types/household';
import type { DateString, DecimalString } from '~/types/http';
import type { Institution } from '~/types/institution';

interface Props {
  household: Household;
  institutions: Institution[];
  currentDate: DateString;
}

interface Emits {
  created: [account: Account];
  cancel: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { locale, t } = useI18n();
const { create } = useAccountApi();

const formElement = ref<HTMLFormElement | null>(null);
const titleElement = ref<HTMLHeadingElement | null>(null);
const kind = ref<AccountKind>('checking');
const name = ref('');
const institutionId = ref('');
const initialBalance = ref('');
const balanceDate = ref<DateString>(props.currentDate);
const isSubmitting = ref(false);
const submissionError = ref('');
const fieldErrors = reactive({
  kind: '',
  name: '',
  institutionId: '',
  initialBalance: '',
  balanceDate: '',
});

type FieldName = keyof typeof fieldErrors;

const accountKinds: AccountKind[] = [
  'checking',
  'savings',
  'cash',
  'investment',
  'credit_card',
  'loan',
  'other_asset',
  'other_liability',
];

// Matches an optional minus sign, integer digits, and an optional dot or comma
// followed by one to four decimal digits. It contains no capture groups.
const decimalPattern = /^-?\d+(?:[.,]\d{1,4})?$/;

const fieldErrorMappings: ReadonlyArray<{
  pointer: string;
  codes: readonly string[];
  field: FieldName;
  translationKey: string;
}> = [
  {
    pointer: '#/name',
    codes: ['invalid_length'],
    field: 'name',
    translationKey: 'accounts.creation.error.name_invalid',
  },
  {
    pointer: '#/kind',
    codes: ['invalid_value'],
    field: 'kind',
    translationKey: 'accounts.creation.error.kind_invalid',
  },
  {
    pointer: '#/institutionId',
    codes: ['invalid_institution', 'invalid_value'],
    field: 'institutionId',
    translationKey: 'accounts.creation.error.institution_invalid',
  },
  {
    pointer: '#/initialBalance',
    codes: ['invalid_value'],
    field: 'initialBalance',
    translationKey: 'accounts.creation.error.balance_invalid',
  },
  {
    pointer: '#/balanceDate',
    codes: ['balance_date_in_future'],
    field: 'balanceDate',
    translationKey: 'accounts.creation.error.date_future',
  },
  {
    pointer: '#/balanceDate',
    codes: ['invalid_value'],
    field: 'balanceDate',
    translationKey: 'accounts.creation.error.date_invalid',
  },
];

const kindOptions = computed<SelectOption[]>(() =>
  accountKinds.map((value) => ({
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

const balanceLabel = computed(() => {
  if (kind.value === 'investment') {
    return t('accounts.creation.current_value');
  }

  if (['credit_card', 'loan', 'other_liability'].includes(kind.value)) {
    return t('accounts.creation.amount_due');
  }

  return t('accounts.creation.current_balance');
});

const currencySymbol = computed(() => {
  const parts = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: props.household.baseCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(0);

  return (
    parts.find(({ type }) => type === 'currency')?.value ??
    props.household.baseCurrency
  );
});

onMounted(() => {
  titleElement.value?.focus();
});

async function submit(): Promise<void> {
  clearErrors();

  if (!validate()) {
    await focusFirstInvalidField();
    return;
  }

  isSubmitting.value = true;

  try {
    const account = await create(props.household.id, {
      institutionId: institutionId.value || null,
      name: name.value.trim(),
      kind: kind.value,
      currency: props.household.baseCurrency,
      initialBalance: normalizeDecimal(initialBalance.value),
      balanceDate: balanceDate.value,
    });
    emit('created', account);
  } catch (cause) {
    if (!applyApiFieldErrors(cause)) {
      submissionError.value = t('accounts.creation.error.generic');
    } else {
      await focusFirstInvalidField();
    }
  } finally {
    isSubmitting.value = false;
  }
}

function validate(): boolean {
  const normalizedName = name.value.trim();
  const normalizedBalance = initialBalance.value.trim();

  if (!normalizedName) {
    fieldErrors.name = t('accounts.creation.error.name_required');
  } else if ([...normalizedName].length > 100) {
    fieldErrors.name = t('accounts.creation.error.name_invalid');
  }

  if (!accountKinds.includes(kind.value)) {
    fieldErrors.kind = t('accounts.creation.error.kind_invalid');
  }

  if (!normalizedBalance) {
    fieldErrors.initialBalance = t('accounts.creation.error.balance_required');
  } else if (!decimalPattern.test(normalizedBalance)) {
    fieldErrors.initialBalance = t('accounts.creation.error.balance_invalid');
  }

  if (!balanceDate.value) {
    fieldErrors.balanceDate = t('accounts.creation.error.date_required');
  } else if (balanceDate.value > props.currentDate) {
    fieldErrors.balanceDate = t('accounts.creation.error.date_future');
  }

  return !Object.values(fieldErrors).some(Boolean);
}

function clearErrors(): void {
  for (const field of Object.keys(fieldErrors) as FieldName[]) {
    fieldErrors[field] = '';
  }
  submissionError.value = '';
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

function normalizeDecimal(value: string): DecimalString {
  return value.trim().replace(',', '.');
}
</script>

<style lang="css" scoped>
.account-form {
  @apply w-full max-w-2xl rounded-surface border border-theme-border-primary;
  @apply bg-theme-bg-card p-6 shadow-surface sm:p-8;
}

.account-form h1 {
  @apply font-poppins text-2xl font-semibold text-theme-text-primary focus:outline-none;
}

.account-form__description {
  @apply mb-6 mt-2 text-sm leading-6 text-theme-text-secondary;
}

.account-form__error {
  @apply mb-5 rounded-control border border-theme-status-error/40;
  @apply bg-theme-status-error/10 p-3 text-sm text-theme-status-error-strong;
}

.account-form > :deep(.bh-form-field),
.account-form > :deep(.bh-date-input) {
  @apply mt-4;
}

.account-form__field-grid {
  @apply mt-4 grid gap-4 sm:grid-cols-2;
}

.account-form__actions {
  @apply mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end;
}

.account-form__actions :deep(.bh-button) {
  @apply w-full sm:w-auto;
}
</style>
