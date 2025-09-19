<template>
  <form class="bh-edit-stock-form" @submit.prevent="handleSubmit">
    <div class="bh-edit-stock-form__presentation">
      <BHImage
        v-if="logo"
        class="bh-edit-stock-form__image"
        :src="logo"
        :alt="t('stock.form.imageAlt')"
      />
      <div v-else class="bh-edit-stock-form__image-placeholder">
        <LucideImageOff :size="24" />
      </div>
      <div class="bh-edit-stock-form__field bh-edit-stock-form__field--full">
        <BHBaseInput
          id="companyName"
          v-model="companyName"
          :label="t('stock.form.name.label')"
          type="text"
          :placeholder="t('stock.form.name.placeholder')"
          :error="errors.name"
        />
      </div>
    </div>
    <div class="bh-edit-stock-form__mandatory">
      <div class="bh-edit-stock-form__field">
        <BHBaseInput
          id="symbol"
          v-model="symbol"
          :label="t('stock.form.symbol.label')"
          type="text"
          :placeholder="t('stock.form.symbol.placeholder')"
          :error="errors.symbol"
        />
      </div>
      <div class="bh-edit-stock-form__field">
        <BHBaseInput
          id="isin"
          v-model="isin"
          :label="t('stock.form.isin.label')"
          type="text"
          :placeholder="t('stock.form.isin.placeholder')"
          :error="errors.isin"
        />
      </div>
    </div>
    <div class="bh-edit-stock-form__geography">
      <div class="bh-edit-stock-form__field">
        <BHBaseSelect
          id="country"
          v-model="country"
          :label="t('stock.form.country.label')"
          :placeholder="t('stock.form.country.placeholder')"
          :options="countryOptions"
          :error="errors.country"
        />
      </div>
      <div class="bh-edit-stock-form__field">
        <BHBaseSelect
          id="market"
          v-model="market"
          :label="t('stock.form.market.label')"
          :placeholder="t('stock.form.market.placeholder')"
          :options="marketOptions"
          :disabled="!country"
          :error="errors.market"
        />
      </div>
    </div>
    <div class="bh-edit-stock-form__classification">
      <div class="bh-edit-stock-form__field">
        <BHBaseSelect
          id="sector"
          v-model="sector"
          :label="t('stock.form.sector.label')"
          :placeholder="t('stock.form.sector.placeholder')"
          :options="sectorOptions"
          :error="errors.sector"
        />
      </div>
      <div class="bh-edit-stock-form__field">
        <BHBaseSelect
          id="industry"
          v-model="industry"
          :label="t('stock.form.industry.label')"
          :placeholder="t('stock.form.industry.placeholder')"
          :options="industryOptions"
          :disabled="!sector"
          :error="errors.industry"
        />
      </div>
    </div>
    <div class="bh-edit-stock-form__badges">
      <div class="bh-edit-stock-form__field">
        <BHBaseSelect
          id="badges"
          v-model="badges"
          :label="t('stock.form.badges.label')"
          :placeholder="t('stock.form.badges.placeholder')"
          :options="badgeOptions"
          multiple
        />
      </div>
    </div>
    <div class="bh-edit-stock-form__actions">
      <BHButton
        type="submit"
        variant="primary"
        class="bh-edit-stock-form__submit"
        :disabled="isSubmitting"
      >
        {{ t('stock.form.submit') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { useI18n } from '#imports';
import { useStockApi } from '~/composables/useStockApi';
import type { CreateStockPayload, Stock } from '~/types/stock';

interface Props {
  stock?: Stock;
}

const props = withDefaults(defineProps<Props>(), {
  stock: () => ({
    name: '',
    symbol: '',
    isin: '',
    logo: '',
    currency: '',
    market: '',
    sector: '',
    industry: '',
    country: '',
    badges: [],
    score: {
      valuation: 0,
      profitability: 0,
      growth: 0,
      solidity: 0,
      shareholderReturn: 0,
      total: 0,
      createdAt: '',
    },
    updatedAt: '',
  }),
});

const { t } = useI18n();
const { create } = useStockApi();

const validationSchema = {
  name: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  symbol: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  isin: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  market: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  country: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  sector: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  industry: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  currency: (value: string) =>
    value && String(value).trim().length > 0
      ? true
      : t('stock.form.errors.required'),
  badges: () => true,
  logo: () => true,
};

const {
  handleSubmit: submitWithValidation,
  defineField,
  errors,
  isSubmitting,
} = useForm<CreateStockPayload>({
  validationSchema,
  initialValues: {
    name: props.stock.name,
    symbol: props.stock.symbol,
    isin: props.stock.isin,
    currency: props.stock.currency || 'USD',
    market: props.stock.market,
    sector: props.stock.sector,
    industry: props.stock.industry,
    country: props.stock.country,
    badges: [...props.stock.badges],
    logo: props.stock.logo,
  },
});

const [companyName] = defineField('name');
const [symbol] = defineField('symbol');
const [isin] = defineField('isin');
const [market] = defineField('market');
const [country] = defineField('country');
const [sector] = defineField('sector');
const [industry] = defineField('industry');
const [badges] = defineField('badges');
const [logo] = defineField('logo');

const submitForm = submitWithValidation(async (formValues) => {
  try {
    const { error } = await create({
      ...formValues,
      badges: formValues.badges ?? [],
      logo: formValues.logo,
    });

    if (error.value) {
      console.error('Failed to create stock', error.value);
      return;
    }

    console.info('Stock created successfully');
  } catch (err) {
    console.error('Unexpected error while creating stock', err);
  }
});

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return;
  }

  const hasErrors = Object.values(errors.value).some((message) => !!message);
  if (hasErrors) {
    return;
  }

  await submitForm();
};

const marketsByCountry: Record<string, { label: string; value: string }[]> = {
  US: [
    { label: 'NYSE', value: 'NYSE' },
    { label: 'NASDAQ', value: 'NASDAQ' },
    { label: 'Cboe BZX Exchange', value: 'CBOE_BZX' },
  ],
  FR: [{ label: 'Euronext Paris', value: 'EURONEXT_PARIS' }],
  UK: [
    { label: 'London Stock Exchange', value: 'LSE' },
    { label: 'Alternative Investment Market', value: 'AIM' },
  ],
  DE: [
    { label: 'Xetra', value: 'XETRA' },
    { label: 'Frankfurt Stock Exchange', value: 'FRA' },
  ],
};

const marketOptions = computed(() => marketsByCountry[country.value] || []);

watch(
  country,
  () => {
    if (!country.value) {
      market.value = '';
      return;
    }

    if (!marketOptions.value.some((option) => option.value === market.value)) {
      market.value = '';
    }
  },
  { immediate: true },
);

const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'France', value: 'FR' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Germany', value: 'DE' },
];

const SECTOR_KEYS = [
  'COMMUNICATION_SERVICES',
  'CONSUMER_DISCRETIONARY',
  'CONSUMER_STAPLES',
  'ENERGY',
  'FINANCIALS',
  'HEALTH_CARE',
  'INDUSTRIALS',
  'INFORMATION_TECHNOLOGY',
  'MATERIALS',
  'REAL_ESTATE',
  'UTILITIES',
] as const;

type SectorKey = (typeof SECTOR_KEYS)[number];

const INDUSTRIES_BY_SECTOR: Record<SectorKey, readonly string[]> = {
  COMMUNICATION_SERVICES: [
    'DIVERSIFIED_TELECOMMUNICATION_SERVICES',
    'WIRELESS_TELECOMMUNICATION_SERVICES',
    'MEDIA',
    'ENTERTAINMENT',
    'INTERACTIVE_MEDIA_SERVICES',
  ],
  CONSUMER_DISCRETIONARY: [
    'AUTOMOBILE_COMPONENTS',
    'AUTOMOBILES',
    'HOUSEHOLD_DURABLES',
    'LEISURE_PRODUCTS',
    'TEXTILES_APPAREL_LUXURY_GOODS',
    'HOTELS_RESTAURANTS_LEISURE',
    'DIVERSIFIED_CONSUMER_SERVICES',
    'DISTRIBUTORS',
    'BROADLINE_RETAIL',
    'SPECIALTY_RETAIL',
  ],
  CONSUMER_STAPLES: [
    'CONSUMER_STAPLES_DISTRIBUTION_RETAIL',
    'BEVERAGES',
    'FOOD_PRODUCTS',
    'TOBACCO',
    'HOUSEHOLD_PRODUCTS',
    'PERSONAL_CARE_PRODUCTS',
  ],
  ENERGY: ['ENERGY_EQUIPMENT_SERVICES', 'OIL_GAS_CONSUMABLE_FUELS'],
  FINANCIALS: [
    'BANKS',
    'FINANCIAL_SERVICES',
    'CONSUMER_FINANCE',
    'CAPITAL_MARKETS',
    'REITS',
    'INSURANCE',
  ],
  HEALTH_CARE: [
    'HEALTH_CARE_EQUIPMENT_SUPPLIES',
    'HEALTH_CARE_PROVIDERS_SERVICES',
    'HEALTH_CARE_TECHNOLOGY',
    'BIOTECHNOLOGY',
    'PHARMACEUTICALS',
    'LIFE_SCIENCES_TOOLS_AND_SERVICES',
  ],
  INDUSTRIALS: [
    'AEROSPACE_DEFENSE',
    'BUILDING_PRODUCTS',
    'CONSTRUCTION_ENGINEERING',
    'ELECTRICAL_EQUIPMENT',
    'INDUSTRIAL_CONGLOMERATES',
    'MACHINERY',
    'TRADING_COMPANIES_DISTRIBUTORS',
    'COMMERCIAL_SERVICES_SUPPLIES',
    'PROFESSIONAL_SERVICES',
    'AIR_FREIGHT_LOGISTICS',
    'PASSENGER_AIRLINES',
    'MARINES_TRANSPORTATION',
    'GROUND_TRANSPORTATION',
    'TRANSPORTATION_INFRASTRUCTURE',
  ],
  INFORMATION_TECHNOLOGY: [
    'IT_SERVICES',
    'SOFTWARE',
    'COMMINUCATIONS_EQUIPMENT',
    'TECHNOLOGY_HARDWARE_STORAGE_PERIPHERALS',
    'ELECTRONIC_EQUIPMENT,INSTRUMENTS_COMPONENTS',
    'SEMICONDUCTORS_AND_SEMICONDUCTOR_EQUIPMENT',
  ],
  MATERIALS: [
    'CHEMICALS',
    'CONSTRUCTION_MATERIALS',
    'CONTAINERS_PACKAGING',
    'METALS_MINING',
    'PAPER_FOREST_PRODUCTS',
  ],
  REAL_ESTATE: [
    'DEVERSIFIED_REITS',
    'INDUSTRIAL_REITS',
    'HOTEL_RESORT_REITS',
    'OFFICE_REITS',
    'RESIDENTIAL_REITS',
    'RETAIL_REITS',
    'SPECIALIZED_REITS',
    'REAL_ESTATE_MANAGEMENT_DEVELOPMENT',
  ],
  UTILITIES: [
    'ELECTRIC_UTILITIES',
    'GAS_UTILITIES',
    'MULTI_UTILITIES',
    'WATER_UTILITIES',
    'INDEPENDENT_POWER_RENEWABLE_ELECTRICITY',
  ],
};

const BADGE_KEYS = [
  'DEEP_VALUE',
  'RECOVERY',
  'HYPERGROWTH',
  'PROFITABLE_GROWTH',
  'COMPOUNDER',
  'CAPITAL_LIGHT_MOAT',
  'DIVIDEND_ARISTO',
  'HIGH_YIELD_DEFENSIVE',
  'HIGH_MOMENTUM',
  'MEAN_REVERT',
  'STABLE_CASHFLOW',
  'BOND_PROXY',
] as const;

const sectorOptions = computed(() =>
  SECTOR_KEYS.map((key) => ({
    label: t(`stock.form.sectors.${key}`),
    value: key,
  })),
);

const industryOptions = computed(() => {
  const sectorKey = sector.value as SectorKey;
  const industries = INDUSTRIES_BY_SECTOR[sectorKey];

  if (!industries) {
    return [];
  }

  return industries.map((key) => ({
    label: t(`stock.form.industries.${key}`),
    value: key,
  }));
});

watch(
  sector,
  () => {
    if (!sector.value) {
      industry.value = '';
      return;
    }

    if (
      !industryOptions.value.some((option) => option.value === industry.value)
    ) {
      industry.value = '';
    }
  },
  { immediate: true },
);

const badgeOptions = computed(() =>
  BADGE_KEYS.map((key) => ({
    label: t(`stock.form.badges.options.${key}`),
    value: key,
  })),
);
</script>

<style lang="css" scoped>
.bh-edit-stock-form {
  @apply flex flex-col gap-6;
}

.bh-edit-stock-form__presentation {
  @apply flex flex-row gap-4;
}

.bh-edit-stock-form__image {
  @apply w-20 h-20 rounded-lg border border-deep-blue-600;
}

.bh-edit-stock-form__image-placeholder {
  @apply w-20 h-20 rounded-lg;
  @apply bg-dark-gray-600 border border-deep-blue-600;
  @apply flex items-center justify-center flex-shrink-0;
  @apply text-sm font-bold text-warm-white-500 cursor-not-allowed;
}

.bh-edit-stock-form__mandatory,
.bh-edit-stock-form__geography,
.bh-edit-stock-form__classification,
.bh-edit-stock-form__badges,
.bh-edit-stock-form__actions {
  @apply flex flex-row gap-4;
}

.bh-edit-stock-form__classification {
  @apply shrink-0;
}

.bh-edit-stock-form__actions {
  @apply justify-end;
}

.bh-edit-stock-form__submit {
  @apply font-bold;
}

.bh-edit-stock-form__field {
  @apply flex flex-col flex-1 gap-1;
}

.bh-edit-stock-form__field--full,
.bh-edit-stock-form__badges .bh-edit-stock-form__field {
  @apply basis-full w-full;
}
</style>
