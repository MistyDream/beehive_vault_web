<template>
  <form class="bh-portfolio-form" @submit.prevent="onSubmit">
    <BHBaseInput
      v-model="form.name"
      :label="$t('portfolios.form.name_label')"
      :error="errors.name"
      required
    />

    <BHBaseSelect
      v-model="form.kind"
      :label="$t('portfolios.form.kind_label')"
      :options="kindOptions"
      :error="errors.kind"
    />

    <BHBaseInput
      v-model="form.currency"
      :label="$t('portfolios.form.currency_label')"
      placeholder="EUR"
      :error="errors.currency"
    />

    <BHTextarea
      v-model="form.description"
      :label="$t('portfolios.form.description_label')"
      :max-length="500"
      :rows="3"
    />

    <div class="bh-portfolio-form__footer">
      <BHButton variant="ghost" type="button" @click="$emit('cancel')">
        {{ $t('portfolios.form.cancel') }}
      </BHButton>
      <BHButton
        variant="primary"
        type="submit"
        :loading="loading"
        :disabled="!isValid"
      >
        {{ $t('portfolios.form.save') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CreatePortfolioPayload, Portfolio, PortfolioKind } from '~/types/portfolio';

interface Props {
  initialValue?: Portfolio;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: undefined,
  loading: false,
});

const emit = defineEmits<{
  (e: 'submit', payload: CreatePortfolioPayload): void;
  (e: 'cancel'): void;
}>();

const { t } = useI18n();

const kindOptions = computed(() => [
  { value: 'real', label: t('portfolios.form.kind_real') },
  { value: 'virtual', label: t('portfolios.form.kind_virtual') },
]);

const form = reactive({
  name: props.initialValue?.name ?? '',
  kind: (props.initialValue?.kind ?? 'real') as PortfolioKind,
  currency: props.initialValue?.currency ?? 'EUR',
  description: props.initialValue?.description ?? '',
});

const errors = reactive({
  name: '',
  kind: '',
  currency: '',
});

function validate(): boolean {
  errors.name = '';
  errors.kind = '';
  errors.currency = '';

  const trimmedName = form.name.trim();
  if (trimmedName.length < 1 || trimmedName.length > 120) {
    errors.name = 'Le nom doit faire entre 1 et 120 caractères';
  }

  if (form.kind !== 'real' && form.kind !== 'virtual') {
    errors.kind = 'Type invalide';
  }

  const trimmedCurrency = form.currency.trim();
  if (trimmedCurrency.length !== 3) {
    errors.currency = 'La devise doit faire exactement 3 caractères';
  }

  return !errors.name && !errors.kind && !errors.currency;
}

const isValid = computed(() => {
  const trimmedName = form.name.trim();
  const trimmedCurrency = form.currency.trim();
  return (
    trimmedName.length >= 1 &&
    trimmedName.length <= 120 &&
    (form.kind === 'real' || form.kind === 'virtual') &&
    trimmedCurrency.length === 3
  );
});

function onSubmit() {
  if (!validate()) return;

  const payload: CreatePortfolioPayload = {
    name: form.name.trim(),
    kind: form.kind,
    currency: form.currency.trim().toUpperCase(),
  };

  if (form.description.trim()) {
    payload.description = form.description.trim();
  }

  emit('submit', payload);
}
</script>

<style lang="css" scoped>
.bh-portfolio-form {
  @apply flex flex-col gap-4;
}

.bh-portfolio-form__footer {
  @apply flex items-center justify-end gap-3;
  @apply mt-2;
}
</style>
