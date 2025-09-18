import { useDrawerStore } from '~/stores/drawer';

const useDrawer = () => {
  const drawerStore = useDrawerStore();

  const toggleWrapper = () => {
    drawerStore.toggleWrapper();
  };

  const open = (
    title: string,
    icon: Component,
    content: Component,
    props?: Record<string, unknown> | null,
  ) => {
    drawerStore.open(title, icon, content, props);
  };

  const close = () => {
    drawerStore.close();
  };

  return {
    showWrapper: computed(() => drawerStore.showWrapper),
    showDrawer: computed(() => drawerStore.showDrawer),
    title: computed(() => drawerStore.title),
    icon: computed(() => drawerStore.icon),
    content: computed(() => drawerStore.content),
    props: computed(() => drawerStore.props),
    toggleWrapper,
    open,
    close,
  };
};

export default useDrawer;
