import type { Component } from 'vue';

export interface NavigationLink {
  text: string;
  to?: string;
  href?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  icon?: Component;
}
