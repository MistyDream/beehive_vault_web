<template>
  <form
    ref="formElement"
    class="account-balance-form"
    novalidate
    @submit.prevent="submit"
  >
    <p class="account-balance-form__description">
      {{
        t(
          balanceToCorrect
            ? 'accounts.balance.correction.description'
            : 'accounts.balance.description',
        )
      }}
    </p>

    <div
      v-if="submissionError"
      class="account-balance-form__error"
      role="alert"
    >
      {{ submissionError }}
    </div>

    <div class="account-balance-form__fields">
      <BHTextInput
        id="account-balance-amount"
        v-model="amount"
        name="amount"
        inputmode="decimal"
        autocomplete="off"
        :label="amountLabel"
        :help="t('accounts.balance.amount_help')"
        :error="fieldErrors.amount"
        :suffix="currencySymbol"
        :disabled="isSubmitting"
        required
      />

      <BHDateInput
        id="account-balance-date"
        v-model="balanceDate"
        :label="t('accounts.balance.date')"
        :max="currentDate"
        :error="fieldErrors.balanceDate"
        :disabled="isSubmitting"
      />
    </div>

    <p
      v-if="!balanceToCorrect && account.balanceDate"
      class="account-balance-form__date-help"
    >
      {{
        t('accounts.balance.date_help', {
          date: formatDate(account.balanceDate),
        })
      }}
    </p>

    <BHTextInput
      id="account-balance-currency"
      :model-value="account.currency"
      :label="t('accounts.balance.currency')"
      :help="t('accounts.balance.currency_help')"
      readonly
    />

    <div class="account-balance-form__explanation">
      <LucideInfo :size="18" aria-hidden="true" />
      <p>
        {{
          t(
            balanceToCorrect
              ? 'accounts.balance.correction.explanation'
              : 'accounts.balance.explanation',
          )
        }}
      </p>
    </div>

    <div class="account-balance-form__actions">
      <BHButton
        type="button"
        variant="secondary"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        {{ t('common.cancel') }}
      </BHButton>
      <BHButton
        type="submit"
        :loading="isSubmitting"
        :disabled="balanceToCorrect && !hasCorrection"
      >
        {{ t('accounts.balance.submit') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ApiFieldErrorMapping } from '~/composables/useApiFormErrors';
import { isLiabilityAccountKind } from '~/constants/account';
import type { Account, Balance, UpdateBalanceRequest } from '~/types/account';
import { ApiError } from '~/types/api';
import type { DateString, DecimalString } from '~/types/http';

interface Props {
  account: Account;
  currentDate: DateString;
  balanceToCorrect?: Balance;
}

interface Emits {
  saved: [balance: Balance];
  cancel: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { locale, t } = useI18n();
const { createBalance, updateBalance } = useAccountApi();

const formElement = ref<HTMLFormElement | null>(null);
const amount = ref(props.balanceToCorrect?.amount ?? '');
const balanceDate = ref<DateString>(
  props.balanceToCorrect?.balanceDate ?? props.currentDate,
);
const isSubmitting = defineModel<boolean>('submitting', { default: false });
const submissionError = ref('');
const fieldErrors = reactive({
  amount: '',
  balanceDate: '',
});

type FieldName = keyof typeof fieldErrors;

// Matches an optional minus sign, integer digits, and an optional dot or comma
// followed by one to four decimal digits. It contains no capture groups.
const decimalPattern = /^-?\d+(?:[.,]\d{1,4})?$/;

const fieldErrorMappings: ReadonlyArray<ApiFieldErrorMapping<FieldName>> = [
  {
    pointer: '#/amount',
    codes: ['invalid_value'],
    field: 'amount',
    translationKey: 'accounts.balance.error.amount_invalid',
  },
  {
    pointer: '#/balanceDate',
    codes: ['balance_date_in_future'],
    field: 'balanceDate',
    translationKey: 'accounts.balance.error.date_future',
  },
  {
    pointer: '#/balanceDate',
    codes: ['balance_date_not_after_latest'],
    field: 'balanceDate',
    translationKey: 'accounts.balance.error.date_not_after_latest',
  },
  {
    pointer: '#/balanceDate',
    codes: ['invalid_value'],
    field: 'balanceDate',
    translationKey: 'accounts.balance.error.date_invalid',
  },
];
const { applyApiFieldErrors, clearFieldErrors, focusFirstInvalidField } =
  useApiFormErrors(fieldErrors, fieldErrorMappings, formElement);

const correction = computed<UpdateBalanceRequest>(() => {
  const original = props.balanceToCorrect;
  const changes: UpdateBalanceRequest = {};
  if (!original) return changes;

  const normalizedAmount = normalizeDecimal(amount.value);
  if (
    decimalComparisonKey(normalizedAmount) !==
    decimalComparisonKey(original.amount)
  ) {
    changes.amount = normalizedAmount;
  }
  if (balanceDate.value !== original.balanceDate) {
    changes.balanceDate = balanceDate.value;
  }
  return changes;
});
const hasCorrection = computed(() => Object.keys(correction.value).length > 0);

const amountLabel = computed(() => {
  if (props.account.kind === 'investment') {
    return t('accounts.balance.new_value');
  }

  if (isLiabilityAccountKind(props.account.kind)) {
    return t('accounts.balance.new_amount_due');
  }

  return t('accounts.balance.new_balance');
});

const currencySymbol = computed(() => {
  const parts = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: props.account.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(0);

  return (
    parts.find(({ type }) => type === 'currency')?.value ??
    props.account.currency
  );
});

const dateFormatter = computed(
  () =>
    new Intl.DateTimeFormat(locale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
);

async function submit(): Promise<void> {
  if (isSubmitting.value || (props.balanceToCorrect && !hasCorrection.value)) {
    return;
  }
  clearErrors();

  if (!validate()) {
    await focusFirstInvalidField();
    return;
  }

  isSubmitting.value = true;

  try {
    const { householdId, id: accountId } = props.account;
    const balance = props.balanceToCorrect
      ? await updateBalance(
          householdId,
          accountId,
          props.balanceToCorrect.id,
          correction.value,
        )
      : await createBalance(householdId, accountId, {
          amount: normalizeDecimal(amount.value),
          balanceDate: balanceDate.value,
          source: 'reconciliation',
        });
    emit('saved', balance);
  } catch (cause) {
    if (cause instanceof ApiError && cause.code === 'duplicate_balance_date') {
      fieldErrors.balanceDate = t('accounts.balance.error.duplicate_date');
    } else if (
      cause instanceof ApiError &&
      cause.code === 'balance_not_found'
    ) {
      submissionError.value = t('accounts.balance.error.not_found');
    } else if (!applyApiFieldErrors(cause)) {
      submissionError.value = t('accounts.balance.error.generic');
    }
  } finally {
    isSubmitting.value = false;
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    await focusFirstInvalidField();
  }
}

function validate(): boolean {
  const normalizedAmount = amount.value.trim();

  if (!normalizedAmount) {
    fieldErrors.amount = t('accounts.balance.error.amount_required');
  } else if (!decimalPattern.test(normalizedAmount)) {
    fieldErrors.amount = t('accounts.balance.error.amount_invalid');
  }

  if (!balanceDate.value) {
    fieldErrors.balanceDate = t('accounts.balance.error.date_required');
  } else if (
    balanceDate.value > props.currentDate &&
    (!props.balanceToCorrect || correction.value.balanceDate !== undefined)
  ) {
    fieldErrors.balanceDate = t('accounts.balance.error.date_future');
  } else if (
    !props.balanceToCorrect &&
    props.account.balanceDate &&
    balanceDate.value <= props.account.balanceDate
  ) {
    fieldErrors.balanceDate = t('accounts.balance.error.date_not_after_latest');
  }

  return !Object.values(fieldErrors).some(Boolean);
}

function clearErrors(): void {
  clearFieldErrors();
  submissionError.value = '';
}

function normalizeDecimal(value: string): DecimalString {
  return value.trim().replace(',', '.');
}

function decimalComparisonKey(value: DecimalString): string {
  if (!decimalPattern.test(value)) return value;

  const negative = value.startsWith('-');
  const [integer = '0', fraction = ''] = (
    negative ? value.slice(1) : value
  ).split('.');
  // Matches leading zeroes in the integer and trailing zeroes in the fraction,
  // respectively. Neither pattern contains capture groups.
  const whole = integer.replace(/^0+/, '') || '0';
  const decimals = fraction.replace(/0+$/, '');
  const magnitude = decimals ? `${whole}.${decimals}` : whole;
  return negative && magnitude !== '0' ? `-${magnitude}` : magnitude;
}

function formatDate(date: DateString): string {
  return dateFormatter.value.format(new Date(`${date}T00:00:00Z`));
}
</script>

<style lang="css" scoped>
.account-balance-form {
  @apply w-full;
}

.account-balance-form__description {
  @apply mb-5 text-sm leading-6 text-theme-text-secondary;
}

.account-balance-form__error {
  @apply mb-5 rounded-control border border-theme-status-error/40;
  @apply bg-theme-status-error/10 p-3 text-sm text-theme-status-error-strong;
}

.account-balance-form__fields {
  @apply grid gap-4 sm:grid-cols-2;
}

.account-balance-form__date-help {
  @apply mt-2 text-xs text-theme-text-muted sm:text-right;
}

.account-balance-form > :deep(.bh-form-field) {
  @apply mt-4;
}

.account-balance-form__explanation {
  @apply mt-5 flex items-start gap-3 rounded-control bg-theme-bg-elevated p-4;
  @apply text-sm leading-6 text-theme-text-secondary;
}

.account-balance-form__explanation svg {
  @apply mt-0.5 shrink-0 text-theme-accent-primary-strong;
}

.account-balance-form__actions {
  @apply mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end;
}

.account-balance-form__actions :deep(.bh-button) {
  @apply w-full sm:w-auto;
}
</style>
