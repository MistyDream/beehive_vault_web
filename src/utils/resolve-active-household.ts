import type {
  Household,
  HouseholdId,
  HouseholdResolution,
} from '~/types/household';
import { ACTIVE_HOUSEHOLD_STATUS } from '../constants/household';

export function resolveActiveHousehold(
  households: readonly Household[],
  storedHouseholdId: HouseholdId | null,
): HouseholdResolution {
  if (households.length === 0) {
    return { status: ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION };
  }

  if (households.length === 1) {
    return {
      status: ACTIVE_HOUSEHOLD_STATUS.READY,
      household: households[0],
    };
  }

  const storedHousehold = households.find(
    (household) => household.id === storedHouseholdId,
  );

  if (storedHousehold) {
    return {
      status: ACTIVE_HOUSEHOLD_STATUS.READY,
      household: storedHousehold,
    };
  }

  return { status: ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION };
}
