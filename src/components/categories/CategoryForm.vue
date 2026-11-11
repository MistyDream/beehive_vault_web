<template>
  <form
    ref="formElement"
    class="category-form"
    novalidate
    @submit.prevent="submit"
  >
    <p v-if="submissionError" class="category-form__error" role="alert">
      {{ submissionError }}
    </p>
    <BHTextInput
      id="category-name"
      v-model="name"
      name="name"
      autocomplete="off"
      maxlength="100"
      :label="t('categories.form.name')"
      :error="fieldErrors.name"
      :disabled="isSubmitting"
      required
    />
    <BHSelect
      v-if="!category"
      id="category-kind"
      v-model="kind"
      name="kind"
      :label="t('categories.form.kind')"
      :options="kindOptions"
      :disabled="isSubmitting"
      required
    />
    <p v-else class="category-form__kind">
      {{
        t('categories.form.fixed_kind', {
          kind: t(`categories.kinds.${category.kind}`),
        })
      }}
    </p>
    <div class="category-form__actions">
      <BHButton
        variant="secondary"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        {{ t('common.cancel') }}
      </BHButton>
      <BHButton type="submit" :loading="isSubmitting">
        {{ t('categories.form.save') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Category, CategoryKind } from '~/types/category';
import type { HouseholdId } from '~/types/household';
import { ApiError } from '~/types/api';

const props = defineProps<{ householdId: HouseholdId; category?: Category }>();
const emit = defineEmits<{ saved: []; cancel: [] }>();
const { t } = useI18n();
const api = useCategoryApi();
const formElement = ref<HTMLFormElement | null>(null);
const name = ref(props.category?.name ?? '');
const kind = ref<CategoryKind>(props.category?.kind ?? 'expense');
const isSubmitting = ref(false);
const submissionError = ref('');
const fieldErrors = reactive({ name: '' });
const { clearFieldErrors, applyApiFieldErrors, focusFirstInvalidField } =
  useApiFormErrors(
    fieldErrors,
    [
      {
        pointer: '#/name',
        codes: ['invalid_length'],
        field: 'name',
        translationKey: 'categories.error.name_invalid',
      },
    ],
    formElement,
  );
const kindOptions = computed(() =>
  (['expense', 'income'] as const).map((value) => ({
    value,
    label: t(`categories.kinds.${value}`),
  })),
);

async function submit(): Promise<void> {
  if (isSubmitting.value) return;
  clearFieldErrors();
  submissionError.value = '';
  const normalizedName = name.value.trim();
  if (!normalizedName || [...normalizedName].length > 100) {
    fieldErrors.name = t('categories.error.name_invalid');
    await focusFirstInvalidField();
    return;
  }

  isSubmitting.value = true;
  try {
    if (props.category) {
      await api.update(props.householdId, props.category.id, {
        name: normalizedName,
      });
    } else {
      await api.create(props.householdId, {
        name: normalizedName,
        kind: kind.value,
      });
    }
    emit('saved');
  } catch (cause) {
    if (cause instanceof ApiError && cause.code === 'duplicate_category_name') {
      fieldErrors.name = t('categories.error.duplicate_name');
    } else if (!applyApiFieldErrors(cause)) {
      submissionError.value = t(
        cause instanceof ApiError && cause.code === 'category_not_found'
          ? 'categories.error.not_found'
          : 'categories.error.save',
      );
    }
    await focusFirstInvalidField();
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.category-form {
  @apply grid gap-4;
}
.category-form__error {
  @apply rounded-control border border-theme-status-error/40 bg-theme-status-error/10 p-3 text-sm text-theme-status-error-strong;
}
.category-form__kind {
  @apply text-sm text-theme-text-secondary;
}
.category-form__actions {
  @apply mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end;
}
</style>
