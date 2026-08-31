import type { DateTimeString } from './http';

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
