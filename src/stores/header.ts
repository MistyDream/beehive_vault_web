import { defineStore } from 'pinia';

export interface HeaderState {
  title: string;
  subtitle: string;
}

export const useHeaderStore = defineStore('header', {
  state: (): HeaderState => ({
    title: '',
    subtitle: '',
  }),
});
