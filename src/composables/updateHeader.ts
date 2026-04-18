import type { HeaderState } from '~/stores/header';
import { useHeaderStore } from '~/stores/header';

export const useUpdateHeader = () => {
  const headerStore = useHeaderStore();

  const updateHeader = (headerState: HeaderState) => {
    headerStore.$patch({
      title: headerState.title,
      subtitle: headerState.subtitle,
    });
  };

  return {
    updateHeader,
  };
};
