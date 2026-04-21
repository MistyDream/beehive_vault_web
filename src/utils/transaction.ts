import {
  LucideArrowDownToLine,
  LucideArrowUpFromLine,
  LucideCircleDollarSign,
  LucideReceipt,
  LucideSplit,
  LucideTrendingDown,
  LucideTrendingUp,
} from '#components';
import type { Component } from 'vue';
import type { Transaction, TransactionType } from '~/types/portfolio';

const TRANSACTION_ICON: Record<TransactionType, Component> = {
  buy: LucideTrendingUp,
  sell: LucideTrendingDown,
  dividend: LucideCircleDollarSign,
  fee: LucideReceipt,
  split: LucideSplit,
  deposit: LucideArrowDownToLine,
  withdrawal: LucideArrowUpFromLine,
};

// Returns null for splits and rows missing both `amount` and `quantity × unit_price`.
export function displayAmount(tx: Transaction): number | null {
  if (tx.amount !== null) return tx.amount;
  if (tx.quantity !== null && tx.unit_price !== null) {
    return tx.quantity * tx.unit_price;
  }
  return null;
}

export function iconForTransaction(type: TransactionType): Component {
  return TRANSACTION_ICON[type];
}
