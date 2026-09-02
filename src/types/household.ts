import type { DateTimeString } from './http';
import type { ACTIVE_HOUSEHOLD_STATUS } from '~/constants/household';

export type HouseholdId = string;
export type CurrencyCode = string;
export type TimeZoneId = string;

export interface Household {
  id: HouseholdId;
  name: string;
  baseCurrency: CurrencyCode;
  timezone: TimeZoneId;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface CreateHouseholdRequest {
  name: string;
  baseCurrency: CurrencyCode;
  timezone: TimeZoneId;
}

export type HouseholdResolution =
  | { status: typeof ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION }
  | { status: typeof ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION }
  | {
      status: typeof ACTIVE_HOUSEHOLD_STATUS.READY;
      household: Household;
    };

export type ActiveHouseholdStatus =
  (typeof ACTIVE_HOUSEHOLD_STATUS)[keyof typeof ACTIVE_HOUSEHOLD_STATUS];
