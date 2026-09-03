import {
  ACTIVE_HOUSEHOLD_STATUS,
  ACTIVE_HOUSEHOLD_STORAGE_KEY,
} from '~/constants/household';
import type {
  ActiveHouseholdStatus,
  Household,
  HouseholdId,
} from '~/types/household';
import { resolveActiveHousehold } from '~/utils/resolve-active-household';

const STATE_KEY = 'active-household';

export function useActiveHousehold() {
  const householdApi = useHouseholdApi();
  const status = useState<ActiveHouseholdStatus>(
    `${STATE_KEY}:status`,
    () => ACTIVE_HOUSEHOLD_STATUS.IDLE,
  );
  const households = useState<Household[]>(`${STATE_KEY}:collection`, () => []);
  const activeHousehold = useState<Household | null>(
    `${STATE_KEY}:current`,
    () => null,
  );
  const error = useState<unknown>(`${STATE_KEY}:error`, () => null);

  async function initialize(): Promise<void> {
    status.value = ACTIVE_HOUSEHOLD_STATUS.LOADING;
    activeHousehold.value = null;
    error.value = null;

    try {
      households.value = await householdApi.list();
      const resolution = resolveActiveHousehold(
        households.value,
        readStoredHouseholdId(),
      );

      if (resolution.status === ACTIVE_HOUSEHOLD_STATUS.READY) {
        activate(resolution.household);
        return;
      }

      clearStoredHouseholdId();
      status.value = resolution.status;
    } catch (cause) {
      households.value = [];
      error.value = cause;
      status.value = ACTIVE_HOUSEHOLD_STATUS.ERROR;
    }
  }

  function activate(household: Household): void {
    if (!households.value.some(({ id }) => id === household.id)) {
      households.value = [...households.value, household];
    }

    activeHousehold.value = household;
    status.value = ACTIVE_HOUSEHOLD_STATUS.READY;
    writeStoredHouseholdId(household.id);
  }

  function startSelection(): void {
    if (activeHousehold.value) {
      status.value = ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION;
    }
  }

  function cancelSelection(): void {
    if (
      activeHousehold.value &&
      status.value === ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION
    ) {
      status.value = ACTIVE_HOUSEHOLD_STATUS.READY;
    }
  }

  function startCreation(): void {
    if (activeHousehold.value) {
      status.value = ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION;
    }
  }

  function cancelCreation(): void {
    if (
      activeHousehold.value &&
      status.value === ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION
    ) {
      status.value = ACTIVE_HOUSEHOLD_STATUS.READY;
    }
  }

  return {
    status: readonly(status),
    households: readonly(households),
    activeHousehold: readonly(activeHousehold),
    error: readonly(error),
    initialize,
    activate,
    startSelection,
    cancelSelection,
    startCreation,
    cancelCreation,
  };
}

function readStoredHouseholdId(): HouseholdId | null {
  if (!import.meta.client) {
    return null;
  }

  return localStorage.getItem(ACTIVE_HOUSEHOLD_STORAGE_KEY);
}

function writeStoredHouseholdId(householdId: HouseholdId): void {
  if (import.meta.client) {
    localStorage.setItem(ACTIVE_HOUSEHOLD_STORAGE_KEY, householdId);
  }
}

function clearStoredHouseholdId(): void {
  if (import.meta.client) {
    localStorage.removeItem(ACTIVE_HOUSEHOLD_STORAGE_KEY);
  }
}
