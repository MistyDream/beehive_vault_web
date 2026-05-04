<template>
  <svg
    class="bh-logo"
    width="48"
    height="80"
    viewBox="0 0 256 428"
    xmlns="http://www.w3.org/2000/svg"
    :aria-hidden="ariaHidden || undefined"
    :role="ariaHidden ? undefined : 'img'"
    :aria-label="ariaHidden ? undefined : t('a11y.logo_label')"
  >
    <path
      class="bh-logo__accent"
      d="M106.5 291.5L71.5 273V357L106.5 372.5V291.5Z"
    />
    <path
      class="bh-logo__accent"
      d="M106.5 114.5L71.5 97V200.5L106.5 184.5V114.5Z"
    />
    <path
      class="bh-logo__shape"
      d="M255.5 66.5L250 177.5L208.5 216L255.5 246L254 361.5L141 427.5L106.5 411H63L0 412V58L50.5 34.5L127 0L255.5 66.5ZM128.794 234.544L61.2939 265.044L61 265.178V363.316L61.2861 363.452L106.786 384.952L107.017 385.061L107.24 384.938L196.74 335.938L196.998 335.798L197 335.504L197.5 272.004L197.502 271.704L197.239 271.561L129.239 234.561L129.021 234.442L128.794 234.544ZM125.789 59.0469L61.2891 89.0469L61 89.1807V216.779L61.709 216.454L195.709 154.954L196 154.82V96.2002L195.735 96.0586L126.235 59.0586L126.015 58.9414L125.789 59.0469Z"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  ariaHidden?: boolean;
}

withDefaults(defineProps<Props>(), {
  ariaHidden: true,
});

const { t } = useI18n();
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-logo {
  @apply block;
}

.bh-logo__shape {
  fill: currentColor;
}

.bh-logo__accent {
  @apply fill-theme-accent-primary stroke-theme-accent-primary;
}
</style>
