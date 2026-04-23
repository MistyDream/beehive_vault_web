import { defineStore } from 'pinia';

export interface DrawerState {
  showWrapper: boolean;
  showDrawer: boolean;
  title: string;
  icon: Component | null;
  content: Component | null;
  props: Record<string, unknown> | null;
  onClose: (() => void) | null;
}

export const useDrawerStore = defineStore('drawer', {
  state: (): DrawerState => ({
    showWrapper: false,
    showDrawer: false,
    title: '',
    icon: null,
    content: null,
    props: null,
    onClose: null,
  }),
  actions: {
    toggleWrapper() {
      this.showWrapper = !this.showWrapper;
    },
    open(
      title: string,
      icon: Component,
      content: Component,
      props?: Record<string, unknown> | null,
      onClose?: (() => void) | null,
    ) {
      this.title = title;
      this.icon = icon;
      this.content = content;
      this.props = props || null;
      this.onClose = onClose || null;
      this.showWrapper = true;
      nextTick(() => {
        this.showDrawer = true;
      });
    },
    close() {
      this.title = '';
      this.icon = null;
      this.content = null;
      this.props = null;
      this.showDrawer = false;
      if (this.onClose) {
        this.onClose();
        this.onClose = null;
      }
    },
  },
});
