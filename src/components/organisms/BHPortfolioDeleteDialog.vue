<template>
  <BHModal
    :model-value="modelValue"
    :title="t('portfolios.detail.delete.title')"
    :icon="LucideTriangleAlert"
    size="md"
    :close-on-overlay-click="!loading"
    :close-on-escape="!loading"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="bh-portfolio-delete">
      <p class="bh-portfolio-delete__warning">
        {{ t('portfolios.detail.delete.description') }}
      </p>

      <p class="bh-portfolio-delete__instruction">
        {{ t('portfolios.detail.delete.confirm_label') }}
      </p>
      <p class="bh-portfolio-delete__target">{{ portfolio.name }}</p>

      <input
        ref="inputRef"
        v-model="typedName"
        type="text"
        :placeholder="portfolio.name"
        :disabled="loading"
        :aria-label="t('portfolios.detail.delete.confirm_input_label')"
        autocomplete="off"
        class="bh-portfolio-delete__input"
      />
    </div>

    <template #footer>
      <BHButton
        variant="ghost"
        type="button"
        :disabled="loading"
        @click="$emit('update:modelValue', false)"
      >
        {{ t('portfolios.detail.delete.cancel') }}
      </BHButton>
      <BHButton
        variant="danger"
        type="button"
        :disabled="!canConfirm"
        :loading="loading"
        @click="$emit('confirm')"
      >
        {{ t('portfolios.detail.delete.confirm') }}
      </BHButton>
    </template>
  </BHModal>
</template>

<script setup lang="ts">
import { LucideTriangleAlert } from '#components';
import type { Portfolio } from '~/types/portfolio';

interface Props {
  modelValue: boolean;
  portfolio: Portfolio;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

const { t } = useI18n();

const typedName = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) {
      typedName.value = '';
      return;
    }
    await nextTick();
    inputRef.value?.focus();
  },
);

const canConfirm = computed(
  () => !props.loading && typedName.value === props.portfolio.name,
);
</script>

<style lang="css" scoped>
.bh-portfolio-delete {
  @apply flex flex-col gap-4;
}

.bh-portfolio-delete__warning {
  @apply text-sm text-theme-text-secondary;
}

.bh-portfolio-delete__instruction {
  @apply text-sm text-theme-text-primary;
}

.bh-portfolio-delete__target {
  @apply px-3 py-2 rounded-md;
  @apply bg-theme-bg-elevated;
  @apply font-mono text-sm text-theme-text-primary font-semibold;
  @apply break-all select-all;
}

.bh-portfolio-delete__input {
  @apply w-full px-4 py-2 rounded-lg;
  @apply bg-theme-bg-card;
  @apply border border-theme-border-secondary;
  @apply text-sm text-theme-text-primary font-medium placeholder:text-theme-text-muted;
  @apply transition-colors duration-150;
  @apply hover:border-theme-border-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:border-transparent;
  @apply disabled:opacity-60 disabled:cursor-not-allowed;
}
</style>
