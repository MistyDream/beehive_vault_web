import {
  LucideArrowDownToLine,
  LucideArrowUpFromLine,
  LucideCircleDollarSign,
  LucideReceipt,
  LucideSplit,
  LucideTrendingDown,
  LucideTrendingUp,
} from '#components';
import type { Transaction, TransactionType } from '~/types/portfolio';

/**
 * Notional amount for display: uses `amount` when present
 * (dividend/fee/deposit/withdrawal), falls back to `quantity × unit_price`
 * for buy/sell. Returns null for splits and incomplete rows.
 */
export function displayAmount(tx: Transaction): number | null {
  if (tx.amount !== null) return tx.amount;
  if (tx.quantity !== null && tx.unit_price !== null) {
    return tx.quantity * tx.unit_price;
  }
  return null;
}

export function iconForTransaction(type: TransactionType) {
  switch (type) {
    case 'buy': return LucideTrendingUp;
    case 'sell': return LucideTrendingDown;
    case 'dividend': return LucideCircleDollarSign;
    case 'fee': return LucideReceipt;
    case 'split': return LucideSplit;
    case 'deposit': return LucideArrowDownToLine;
    case 'withdrawal': return LucideArrowUpFromLine;
  }
}
