export function useFieldIds(explicitId?: MaybeRefOrGetter<string | undefined>) {
  const autoId = useId();
  const inputId = computed(() => toValue(explicitId) || autoId);
  const helpId = computed(() => `${inputId.value}-help`);
  const errorId = computed(() => `${inputId.value}-error`);
  return { inputId, helpId, errorId };
}

export function useSelectIds(
  explicitId?: MaybeRefOrGetter<string | undefined>,
) {
  const { inputId: triggerId, errorId } = useFieldIds(explicitId);
  const listboxId = computed(() => `${triggerId.value}-listbox`);
  const optionId = (index: number) => `${triggerId.value}-option-${index}`;
  return { triggerId, listboxId, errorId, optionId };
}
