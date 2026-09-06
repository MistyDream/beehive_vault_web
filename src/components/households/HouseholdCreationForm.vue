<template>
  <form
    ref="formElement"
    class="household-creation-form"
    novalidate
    @submit.prevent="submit"
  >
    <h1 ref="titleElement" tabindex="-1">
      {{ t('household.creation.title') }}
    </h1>
    <p class="household-creation-form__description">
      {{ t('household.creation.description') }}
    </p>

    <div
      v-if="submissionError"
      class="household-creation-form__submission-error"
      role="alert"
    >
      {{ submissionError }}
    </div>

    <BHTextInput
      id="household-name"
      v-model="name"
      name="name"
      autocomplete="organization"
      :label="t('household.creation.name')"
      :error="fieldErrors.name"
      :disabled="isSubmitting"
      maxlength="100"
      required
    />

    <div class="household-creation-form__field-grid">
      <BHSelect
        id="household-currency"
        v-model="baseCurrency"
        name="baseCurrency"
        :label="t('household.creation.currency')"
        :help="t('household.creation.currency_help')"
        :error="fieldErrors.baseCurrency"
        :options="currencyOptions"
        :disabled="isSubmitting"
        required
      />
      <BHSelect
        id="household-timezone"
        v-model="timezone"
        name="timezone"
        :label="t('household.creation.timezone')"
        :help="t('household.creation.timezone_help')"
        :error="fieldErrors.timezone"
        :options="timezoneOptions"
        :disabled="isSubmitting"
        required
      />
    </div>

    <div class="household-creation-form__actions">
      <BHButton
        v-if="cancelable"
        type="button"
        variant="secondary"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        {{ t('household.creation.cancel') }}
      </BHButton>
      <BHButton type="submit" :loading="isSubmitting">
        {{ t('household.creation.submit') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ApiError } from '~/types/api';
import type { SelectOption } from '~/types/form';
import type { Household } from '~/types/household';

interface Props {
  cancelable?: boolean;
}

interface Emits {
  created: [household: Household];
  cancel: [];
}

withDefaults(defineProps<Props>(), {
  cancelable: false,
});

const emit = defineEmits<Emits>();
const { t, locale } = useI18n();
const { create } = useHouseholdApi();
const { activate } = useActiveHousehold();
const toast = useToast();

const formElement = ref<HTMLFormElement | null>(null);
const titleElement = ref<HTMLHeadingElement | null>(null);
const name = ref('');
const baseCurrency = ref('EUR');
const timezone = ref(detectTimeZone());
const isSubmitting = ref(false);
const submissionError = ref('');
const fieldErrors = reactive({
  name: '',
  baseCurrency: '',
  timezone: '',
});
const fieldErrorMappings = [
  {
    pointer: '#/name',
    codes: ['invalid_length'],
    field: 'name',
    translationKey: 'household.creation.error.name_invalid',
  },
  {
    pointer: '#/baseCurrency',
    codes: ['invalid_value'],
    field: 'baseCurrency',
    translationKey: 'household.creation.error.currency_invalid',
  },
  {
    pointer: '#/timezone',
    codes: ['invalid_timezone', 'invalid_value'],
    field: 'timezone',
    translationKey: 'household.creation.error.timezone_invalid',
  },
] as const;

const currencyOptions = computed<SelectOption[]>(() => {
  const displayNames = new Intl.DisplayNames([locale.value], {
    type: 'currency',
  });

  return getSupportedValues('currency', ['EUR']).map((code) => ({
    value: code,
    label: `${displayNames.of(code) ?? code} — ${code}`,
  }));
});

const timezoneOptions = computed<SelectOption[]>(() => {
  const values = getSupportedValues('timeZone', [timezone.value, 'UTC']);

  if (!values.includes(timezone.value)) {
    values.push(timezone.value);
  }

  return values
    .sort(new Intl.Collator(locale.value).compare)
    .map((value) => ({ value, label: value }));
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
    const household = await create({
      name: name.value.trim(),
      baseCurrency: baseCurrency.value,
      timezone: timezone.value,
    });
    activate(household);
    toast.success(t('household.creation.success'));
    emit('created', household);
  } catch (cause) {
    if (!applyApiFieldErrors(cause)) {
      submissionError.value = t('household.creation.error.generic');
    }
  } finally {
    isSubmitting.value = false;
  }
}

function validate(): boolean {
  const normalizedName = name.value.trim();

  if (!normalizedName) {
    fieldErrors.name = t('household.creation.error.name_required');
  } else if ([...normalizedName].length > 100) {
    fieldErrors.name = t('household.creation.error.name_invalid');
  }

  if (!baseCurrency.value) {
    fieldErrors.baseCurrency = t('household.creation.error.currency_invalid');
  }

  if (!timezone.value) {
    fieldErrors.timezone = t('household.creation.error.timezone_invalid');
  }

  return !Object.values(fieldErrors).some(Boolean);
}

function clearErrors(): void {
  fieldErrors.name = '';
  fieldErrors.baseCurrency = '';
  fieldErrors.timezone = '';
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
        pointer === error.pointer && codes.some((code) => code === error.code),
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

function detectTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function getSupportedValues(
  key: 'currency' | 'timeZone',
  fallback: string[],
): string[] {
  try {
    return [...Intl.supportedValuesOf(key)];
  } catch {
    return [...fallback];
  }
}
</script>

<style lang="css" scoped>
.household-creation-form {
  @apply w-full max-w-[470px] rounded-surface border border-theme-border-primary;
  @apply bg-theme-bg-card p-6 shadow-surface sm:p-8;
}

.household-creation-form h1 {
  @apply text-2xl font-medium text-theme-text-primary focus:outline-none;
}

.household-creation-form__description {
  @apply mb-6 mt-2 text-sm leading-6 text-theme-text-secondary;
}

.household-creation-form__submission-error {
  @apply mb-5 rounded-control border border-theme-status-error/40;
  @apply bg-theme-status-error/10 p-3 text-sm text-theme-status-error-strong;
}

.household-creation-form__field-grid {
  @apply mt-4 grid gap-4 sm:grid-cols-2;
}

.household-creation-form__actions {
  @apply mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end;
}

.household-creation-form__actions :deep(.bh-button) {
  @apply w-full sm:w-auto;
}
</style>
