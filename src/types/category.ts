import type { HouseholdId } from '~/types/household';
import type { DateTimeString } from '~/types/http';

export type CategoryId = string;
export type CategoryKind = 'income' | 'expense';

export interface Category {
  id: CategoryId;
  householdId: HouseholdId;
  name: string;
  kind: CategoryKind;
  archivedAt: DateTimeString | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface CategoryListFilters {
  kind?: CategoryKind;
}

export interface CreateCategoryRequest {
  name: string;
  kind: CategoryKind;
}

export interface UpdateCategoryRequest {
  name: string;
}
