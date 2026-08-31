import type { AccountId } from '~/types/account';
import type { HouseholdId } from '~/types/household';
import type {
  DateString,
  DateTimeString,
  DecimalString,
  Page,
  PaginationParams,
} from '~/types/http';
import type { AccountSummary, TransactionId } from '~/types/transaction';

export type TransferId = string;

export interface TransferMovement {
  transactionId: TransactionId;
  accountId: AccountId;
  bookingDate: DateString;
  label: string;
  amount: DecimalString;
  note: string | null;
}

export interface Transfer {
  id: TransferId;
  householdId: HouseholdId;
  amount: DecimalString;
  source: TransferMovement;
  destination: TransferMovement;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export type TransferPage = Page<Transfer>;
export type TransferListFilters = PaginationParams;

export interface TransferMovementOperation {
  transactionId: TransactionId;
  bookingDate: DateString;
  label: string;
  accountAmount: DecimalString;
  account: AccountSummary;
  note: string | null;
}

export interface TransferOperation {
  operationType: 'transfer';
  id: TransferId;
  householdId: HouseholdId;
  bookingDate: DateString;
  amount: DecimalString;
  source: TransferMovementOperation;
  destination: TransferMovementOperation;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface TransferMovementRequest {
  accountId: AccountId;
  bookingDate: DateString;
  label: string;
  note?: string | null;
}

export interface CreateTransferRequest {
  amount: DecimalString;
  source: TransferMovementRequest;
  destination: TransferMovementRequest;
}

export interface UpdateTransferMovementRequest {
  accountId?: AccountId;
  bookingDate?: DateString;
  label?: string;
  note?: string | null;
}

export interface UpdateTransferRequest {
  amount?: DecimalString;
  source?: UpdateTransferMovementRequest;
  destination?: UpdateTransferMovementRequest;
}
