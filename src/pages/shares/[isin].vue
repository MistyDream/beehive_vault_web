<template>
  <BHShareDetailTemplate>
    <template #logo>
      <BHImage
        v-if="stock.logo"
        class="share-detail--header-logo-image"
        :src="stock.logo"
        :alt="stock.name"
      />
      <div v-else class="share-detail--header-logo-placeholder">
        {{ stock.name.charAt(0).toUpperCase() }}
        {{ stock.name.charAt(1)?.toUpperCase() || '' }}
      </div>
    </template>
    <template #share-name>{{ stock.name }}</template>
    <template #share-meta>
      <span>
        <LucideTag :size="12" />
        {{ stock.symbol }}
      </span>
      <span>
        <LucideBarcode :size="13" />
        {{ stock.isin }}
      </span>
      <span>
        <LucideBuilding :size="12" />
        {{ t('stock.form.industries.' + stock.industry) }}
      </span>
    </template>
    <template #globale-note>
      <BHShareGlobaleNote :note="stock.score?.total ?? 0" />
    </template>
    <template #share-categories>
      <BHScoreCard
        v-for="(note, key) in categoriesNote"
        :key="key"
        :label="note.label"
        :score="note.score"
        :icon="note.icon"
        :icon-color="note.iconColor"
      />
    </template>
    <template #categories>
      <BHCategoryScoreCard
        :title="t('valuation')"
        description="Évaluation du prix de l'action par rapport à sa valeur intrinsèque"
        :icon="LucideDollarSign"
        :score="stock.score?.valuation"
        :metric-score="stock.score?.valuationScore"
      />
      <BHCategoryScoreCard
        :title="t('growth')"
        description="Dynamique de développement du chiffre d'affaires et des résultats"
        :icon="LucideChartSpline"
        icon-color="green"
        :score="stock.score?.growth"
        :metric-score="stock.score?.growthScore"
      />
      <BHCategoryScoreCard
        :title="t('profitability')"
        description="Capacité de l'entreprise à générer des profits"
        :icon="LucideCalculator"
        icon-color="blue"
        :score="stock.score?.profitability"
        :metric-score="stock.score?.profitabilityScore"
      />
      <BHCategoryScoreCard
        :title="t('financial-health')"
        description="Solidité du bilan et capacité de financement"
        :icon="LucideLandmark"
        icon-color="orange"
        :score="stock.score?.solidity"
        :metric-score="stock.score?.solidityScore"
      />
      <BHCategoryScoreCard
        :title="t('investor-returns')"
        description="Rémunération des actionnaires et politique de distribution"
        :icon="LucideGift"
        icon-color="red"
        :score="stock.score?.shareholderReturn"
        :metric-score="stock.score?.shareholderReturnScore"
      />
    </template>
  </BHShareDetailTemplate>
</template>

<script setup lang="ts">
import {
  LucideBuilding,
  LucideCalculator,
  LucideChartSpline,
  LucideDollarSign,
  LucideGift,
  LucideLandmark,
} from '#components';
import type { ScoreCardProps } from '~/components/molecules/BHScoreCard.vue';
import type { Stock } from '~/types/stock';

const { t } = useI18n();
const { updateHeader } = useUpdateHeader();
const { isin } = useRoute().params;
const { detail } = useStockApi();

const { data } = await detail(isin as string);

const stock = computed<Stock>(() => data.value || ({} as Stock));

const categoriesNote = computed<ScoreCardProps[]>(() => [
  {
    label: t('valuation'),
    score: stock.value.score?.valuation,
    icon: LucideDollarSign,
  },
  {
    label: t('growth'),
    score: stock.value.score?.growth,
    icon: LucideChartSpline,
    iconColor: 'green',
  },
  {
    label: t('profitability'),
    score: stock.value.score?.profitability,
    icon: LucideCalculator,
    iconColor: 'blue',
  },
  {
    label: t('financial-health'),
    score: stock.value.score?.solidity,
    icon: LucideLandmark,
    iconColor: 'orange',
  },
  {
    label: t('investor-returns'),
    score: stock.value.score?.shareholderReturn,
    icon: LucideGift,
    iconColor: 'red',
  },
]);

onMounted(() => {
  updateHeader({
    title: '',
    subtitle: '',
  });
});
</script>

<style lang="css" scoped>
.share-detail--header-logo-image {
  @apply w-16 h-16 rounded-xl;
  @apply border border-border-dark;
}

.share-detail--header-logo-placeholder {
  @apply relative flex flex-shrink-0 items-center justify-center;
  @apply w-16 h-16 rounded-xl;
  @apply border border-border-dark;
  @apply bg-gradient-to-br from-golden-yellow-500 to-golden-yellow-900;
  @apply text-2xl font-bold text-warm-white-500;
}

.share-detail--header-info--meta {
  @apply flex gap-3;
  @apply text-sm font-poppins text-dark-gray-400;
}

.share-detail--header-info--meta span {
  @apply flex gap-1 items-center;
}
</style>
