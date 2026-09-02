import type { Component } from 'vue';

export interface NavigationItem {
  label: string;
  to: string;
  icon: Component;
}
