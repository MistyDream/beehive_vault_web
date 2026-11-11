import type {
  Category,
  CategoryId,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '~/types/category';
import type { HouseholdId } from '~/types/household';

export function useCategoryApi() {
  const { $api } = useNuxtApp();

  const collectionPath = (householdId: HouseholdId) =>
    `/households/${householdId}/categories`;

  return {
    list: (householdId: HouseholdId) =>
      $api<Category[]>(collectionPath(householdId)),
    create: (householdId: HouseholdId, request: CreateCategoryRequest) =>
      $api<Category>(collectionPath(householdId), {
        method: 'POST',
        body: request,
      }),
    update: (
      householdId: HouseholdId,
      categoryId: CategoryId,
      request: UpdateCategoryRequest,
    ) =>
      $api<Category>(`${collectionPath(householdId)}/${categoryId}`, {
        method: 'PATCH',
        body: request,
      }),
    archive: (householdId: HouseholdId, categoryId: CategoryId) =>
      $api<undefined>(`${collectionPath(householdId)}/${categoryId}`, {
        method: 'DELETE',
      }),
  };
}
