<template>
  <div class="categories-page">
    <header class="categories-page__header">
      <div>
        <h1 ref="titleElement" tabindex="-1">{{ t('categories.title') }}</h1>
        <p>{{ t('categories.description') }}</p>
      </div>
      <BHButton @click="openForm()">
        <LucidePlus :size="18" aria-hidden="true" />
        {{ t('categories.add') }}
      </BHButton>
    </header>

    <div
      v-if="!categories && (status === 'idle' || status === 'pending')"
      role="status"
      class="categories-page__loading"
    >
      <span class="sr-only">{{ t('categories.loading') }}</span>
      <div aria-hidden="true" />
    </div>
    <section v-if="error" class="categories-page__error" role="alert">
      <h2>{{ t('categories.error.load') }}</h2>
      <p>
        {{
          t(
            categories
              ? 'categories.error.refresh_description'
              : 'categories.error.load_description',
          )
        }}
      </p>
      <BHButton @click="refresh">{{ t('common.retry') }}</BHButton>
    </section>
    <p v-if="categories && status === 'pending'" role="status">
      {{ t('categories.loading') }}
    </p>

    <template v-if="categories">
      <BHSurface
        v-if="categories.length === 0"
        as="section"
        class="categories-page__empty"
      >
        <h2>{{ t('categories.empty') }}</h2>
        <p>{{ t('categories.empty_description') }}</p>
      </BHSurface>
      <section
        v-for="group in groups"
        v-else
        :key="group.kind"
        class="categories-page__group"
        :aria-labelledby="group.titleId"
      >
        <h2 :id="group.titleId">{{ t(`categories.kinds.${group.kind}`) }}</h2>
        <p v-if="group.items.length === 0">{{ t('categories.group_empty') }}</p>
        <ul v-else>
          <li v-for="category in group.items" :key="category.id">
            <LucideTag :size="20" aria-hidden="true" />
            <span>{{ category.name }}</span>
            <div class="categories-page__actions">
              <BHButton
                variant="ghost"
                :aria-label="
                  t('categories.rename_named', { name: category.name })
                "
                @click="openForm(category)"
              >
                {{ t('categories.rename') }}
              </BHButton>
              <BHButton
                variant="ghost"
                :aria-label="
                  t('categories.archive_named', { name: category.name })
                "
                @click="openArchive(category)"
              >
                {{ t('categories.archive') }}
              </BHButton>
            </div>
          </li>
        </ul>
      </section>
    </template>

    <BHModal
      v-model="isFormOpen"
      :title="t(editedCategory ? 'categories.edit_title' : 'categories.add')"
    >
      <CategoryForm
        v-if="isFormOpen"
        :household-id="householdId"
        :category="editedCategory"
        @saved="handleSaved"
        @cancel="isFormOpen = false"
      />
    </BHModal>
    <BHModal
      :model-value="!!archivedCategory"
      :title="t('categories.archive_title')"
      :described-by="archiveDescriptionId"
      @update:model-value="!$event && (archiveDialog = undefined)"
    >
      <p :id="archiveDescriptionId">
        {{
          t('categories.archive_description', { name: archivedCategory?.name })
        }}
      </p>
      <p
        v-if="archiveError"
        class="categories-page__archive-error"
        role="alert"
      >
        {{ archiveError }}
      </p>
      <template #footer>
        <BHButton
          variant="secondary"
          :disabled="isArchiving"
          @click="archiveDialog = undefined"
          >{{ t('common.cancel') }}</BHButton
        >
        <BHButton
          variant="danger"
          :loading="isArchiving"
          @click="archiveCategory"
          >{{ t('categories.archive') }}</BHButton
        >
      </template>
    </BHModal>
  </div>
</template>

<script setup lang="ts">
import type { Category, CategoryKind } from '~/types/category';
import type { HouseholdId } from '~/types/household';
import { ApiError } from '~/types/api';

const props = defineProps<{ householdId: HouseholdId }>();
const { t } = useI18n();
const api = useCategoryApi();
const toast = useToast();
const titleElement = ref<HTMLHeadingElement | null>(null);
const groupId = useId();
const archiveDescriptionId = useId();
const {
  data: loadedCategories,
  status,
  error,
  refresh,
} = await useLazyAsyncData(`categories:${props.householdId}`, () =>
  api.list(props.householdId),
);
const categories = shallowRef<Category[]>();
watch(
  loadedCategories,
  (loaded) => {
    if (loaded) categories.value = loaded;
  },
  { immediate: true },
);
const groups = computed(() =>
  (['expense', 'income'] as CategoryKind[]).map((kind) => ({
    kind,
    titleId: `${groupId}-${kind}`,
    items: (categories.value ?? []).filter(
      (category) => category.kind === kind,
    ),
  })),
);
const isFormOpen = ref(false);
const editedCategory = ref<Category>();
const archiveDialog = ref<{
  category: Category;
  pending: boolean;
  error: string;
}>();
const archivedCategory = computed(() => archiveDialog.value?.category);
const isArchiving = computed(() => archiveDialog.value?.pending ?? false);
const archiveError = computed(() => archiveDialog.value?.error ?? '');
let isActive = true;
onBeforeUnmount(() => {
  isActive = false;
});
onMounted(() => titleElement.value?.focus());

function openForm(category?: Category): void {
  editedCategory.value = category;
  isFormOpen.value = true;
}

async function handleSaved(): Promise<void> {
  if (!isActive) return;
  isFormOpen.value = false;
  toast.success(
    t(editedCategory.value ? 'categories.saved' : 'categories.created'),
  );
  await refresh();
}

function openArchive(category: Category): void {
  archiveDialog.value = { category, pending: false, error: '' };
}

async function archiveCategory(): Promise<void> {
  const dialog = archiveDialog.value;
  if (!dialog || dialog.pending) return;
  dialog.pending = true;
  dialog.error = '';
  try {
    await api.archive(props.householdId, dialog.category.id);
    if (!isActive) return;
    const wasCurrentDialog = archiveDialog.value === dialog;
    if (wasCurrentDialog) archiveDialog.value = undefined;
    toast.success(t('categories.archived'));
    await refresh();
    if (wasCurrentDialog && !archiveDialog.value && !isFormOpen.value) {
      await nextTick();
      titleElement.value?.focus();
    }
  } catch (cause) {
    if (!isActive) return;
    dialog.error = t(
      cause instanceof ApiError && cause.code === 'category_not_found'
        ? 'categories.error.not_found'
        : 'categories.error.archive',
    );
  } finally {
    dialog.pending = false;
  }
}
</script>

<style scoped>
.categories-page {
  @apply mx-auto grid w-full max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8;
}
.categories-page__header {
  @apply flex flex-wrap items-start justify-between gap-4;
}
.categories-page__header h1 {
  @apply font-poppins text-2xl font-semibold text-theme-text-primary focus:outline-none md:text-3xl;
}
.categories-page__header p,
.categories-page__group > p,
.categories-page__empty p {
  @apply mt-2 text-sm text-theme-text-secondary;
}
.categories-page__group h2 {
  @apply mb-3 font-poppins text-lg font-semibold text-theme-text-primary;
}
.categories-page__group ul {
  @apply divide-y divide-theme-border-primary rounded-surface border border-theme-border-primary bg-theme-bg-card;
}
.categories-page__group li {
  @apply flex flex-wrap items-center gap-3 p-3 sm:p-4;
}
.categories-page__group li > svg {
  @apply shrink-0 text-theme-text-muted;
}
.categories-page__group li > span {
  @apply min-w-0 flex-1 break-words text-sm text-theme-text-primary;
  overflow-wrap: anywhere;
}
.categories-page__actions {
  @apply flex flex-wrap gap-2;
}
.categories-page__empty,
.categories-page__error {
  @apply rounded-surface border border-theme-border-primary bg-theme-bg-card p-6;
}
.categories-page__error p {
  @apply my-3 text-sm text-theme-text-secondary;
}
.categories-page__archive-error {
  @apply mt-4 text-sm text-theme-status-error-strong;
}
.categories-page__loading > div {
  @apply h-64 animate-pulse rounded-surface bg-theme-bg-card;
}
@media (prefers-reduced-motion: reduce) {
  .categories-page__loading > div {
    animation: none;
  }
}
</style>
