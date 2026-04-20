<template>
  <form class="bh-portfolio-form" @submit.prevent="onSubmit">
    <BHBaseInput
      v-model="form.name"
      :label="t('portfolios.form.name_label')"
      :error="errors.name"
      required
    />

    <BHBaseSelect
      v-model="form.kind"
      :label="t('portfolios.form.kind_label')"
      :options="kindOptions"
    />

    <BHBaseInput
      v-model="form.currency"
      :label="t('portfolios.form.currency_label')"
      placeholder="EUR"
      :error="errors.currency"
    />

    <BHTextarea
      v-model="form.description"
      :label="t('portfolios.form.description_label')"
      :max-length="500"
      :rows="3"
    />

    <div class="bh-portfolio-form__footer">
      <BHButton variant="ghost" type="button" @click="$emit('cancel')">
        {{ t('portfolios.form.cancel') }}
      </BHButton>
      <BHButton
        variant="primary"
        type="submit"
        :loading="loading"
      >
        {{ t('portfolios.form.save') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  PORTFOLIO_KINDS,
  type CreatePortfolioPayload,
  type Portfolio,
  type PortfolioKind,
} from '~/types/portfolio';

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

const kindOptions = computed(() =>
  PORTFOLIO_KINDS.map((kind) => ({
    value: kind,
    label: t(`portfolios.form.kind_${kind}`),
  })),
);

const form = reactive({
  name: props.initialValue?.name ?? '',
  kind: (props.initialValue?.kind ?? 'real') as PortfolioKind,
  currency: props.initialValue?.currency ?? 'EUR',
  description: props.initialValue?.description ?? '',
});

const errors = reactive({
  name: '',
  currency: '',
});

function validate(): boolean {
  errors.name = '';
  errors.currency = '';

  const trimmedName = form.name.trim();
  if (trimmedName.length < 1 || trimmedName.length > 120) {
    errors.name = t('portfolios.form.errors.name_length');
  }

  const trimmedCurrency = form.currency.trim();
  if (trimmedCurrency.length !== 3) {
    errors.currency = t('portfolios.form.errors.currency_length');
  }

  return !errors.name && !errors.currency;
}

function onSubmit() {
  if (!validate()) return;

  const description = form.description.trim();
  const payload: CreatePortfolioPayload = {
    name: form.name.trim(),
    kind: form.kind,
    currency: form.currency.trim().toUpperCase(),
    ...(description && { description }),
  };

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
