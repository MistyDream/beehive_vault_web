export function useFieldIds(explicitId?: MaybeRefOrGetter<string | undefined>) {
  const autoId = useId();
  const inputId = computed(() => toValue(explicitId) || autoId);
  const errorId = computed(() => `${inputId.value}-error`);
  return { inputId, errorId };
}

export function useSelectIds(
  explicitId?: MaybeRefOrGetter<string | undefined>,
) {
  const { inputId: triggerId, errorId } = useFieldIds(explicitId);
  const listboxId = computed(() => `${triggerId.value}-listbox`);
  const optionId = (index: number) => `${triggerId.value}-option-${index}`;
  return { triggerId, listboxId, errorId, optionId };
}
