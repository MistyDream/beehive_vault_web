import type { Component } from 'vue';

export interface NavigationLink {
  text: string;
  to?: string;
  href?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  danger?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: Component;
  onClick?: () => void;
  children?: NavigationLink[];
  isExpandable?: boolean;
}
