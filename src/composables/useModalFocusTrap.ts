import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import type { Ref } from 'vue';

interface UseModalFocusTrapOptions {
  escapeDeactivates?: boolean;
}

export function useModalFocusTrap(
  target: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  options: UseModalFocusTrapOptions = {},
) {
  const { activate, deactivate, pause, unpause } = useFocusTrap(target, {
    allowOutsideClick: true,
    returnFocusOnDeactivate: false,
    escapeDeactivates: options.escapeDeactivates ?? true,
  });

  let previousFocus: HTMLElement | null = null;

  watch(
    isOpen,
    (open) => {
      if (open) {
        previousFocus = document.activeElement as HTMLElement | null;
        nextTick(() => activate());
      } else {
        deactivate();
        if (previousFocus && document.body.contains(previousFocus)) {
          previousFocus.focus({ preventScroll: true });
        }
        previousFocus = null;
      }
    },
    { immediate: true },
  );

  return { pause, unpause };
}
