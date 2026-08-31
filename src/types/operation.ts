import type { Page } from '~/types/http';
import type { TransactionOperation } from '~/types/transaction';
import type { TransferOperation } from '~/types/transfer';

export type Operation = TransactionOperation | TransferOperation;
export type OperationPage = Page<Operation>;
