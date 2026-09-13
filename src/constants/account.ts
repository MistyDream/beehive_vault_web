import type { AccountKind } from '~/types/account';

export const ACCOUNT_COMPOSITION_KEYS = [
  'daily',
  'savings',
  'liabilities',
] as const;

export type AccountCompositionKey = (typeof ACCOUNT_COMPOSITION_KEYS)[number];

export const ACCOUNT_COMPOSITION_BY_KIND = {
  checking: 'daily',
  savings: 'savings',
  cash: 'daily',
  investment: 'savings',
  credit_card: 'liabilities',
  loan: 'liabilities',
  other_asset: 'savings',
  other_liability: 'liabilities',
} as const satisfies Record<AccountKind, AccountCompositionKey>;

export const ACCOUNT_KINDS = Object.freeze(
  Object.keys(ACCOUNT_COMPOSITION_BY_KIND) as AccountKind[],
);

export const ASSET_ACCOUNT_KINDS = Object.freeze(
  ACCOUNT_KINDS.filter((kind) => !isLiabilityAccountKind(kind)),
);

export const LIABILITY_ACCOUNT_KINDS = Object.freeze(
  ACCOUNT_KINDS.filter(isLiabilityAccountKind),
);

export function isLiabilityAccountKind(kind: AccountKind): boolean {
  return ACCOUNT_COMPOSITION_BY_KIND[kind] === 'liabilities';
}
