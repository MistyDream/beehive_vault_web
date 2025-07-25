<template>
  <div ref="triggerRef" class="bh-dropdown">
    <!-- Trigger -->
    <div
      class="bh-dropdown__trigger"
      tabindex="0"
      role="button"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="handleToggle"
      @keydown.enter="handleToggle"
      @keydown.space.prevent="handleToggle"
      @keydown.escape="close"
      @keydown.arrow-down.prevent="open"
    >
      <slot
        name="trigger"
        :is-open="isOpen"
        :toggle="toggle"
        :open="open"
        :close="close"
      >
        <button class="bh-dropdown__default-trigger" :disabled="disabled">
          Select an option
          <svg
            class="bh-dropdown__arrow"
            :class="{ 'bh-dropdown__arrow--open': isOpen }"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </slot>
    </div>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <div
        v-if="showMenu"
        ref="floatingRef"
        class="bh-dropdown__menu animate__animated"
        :class="animationClass"
        :style="menuStyles"
        role="menu"
        tabindex="-1"
      >
        <slot name="content" :close="close" :is-open="isOpen" :toggle="toggle">
          <div class="bh-dropdown__default-content">
            <div class="bh-dropdown__item" role="menuitem" tabindex="-1">
              Option 1
            </div>
            <div class="bh-dropdown__item" role="menuitem" tabindex="-1">
              Option 2
            </div>
            <div class="bh-dropdown__item" role="menuitem" tabindex="-1">
              Option 3
            </div>
          </div>
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean;
  disabled?: boolean;
  placement?:
    | 'bottom-start'
    | 'bottom-end'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'top';
  offset?: number;
  autoClose?: boolean;
  animationType?: 'fade' | 'slide' | 'zoom' | 'bounce';
}

interface Emits {
  'update:modelValue': [value: boolean];
  open: [];
  close: [];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  placement: 'bottom-start',
  offset: 8,
  autoClose: true,
  animationType: 'fade',
});

const emit = defineEmits<Emits>();

// Refs pour les éléments
const triggerRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();

// État du dropdown avec VueUse
const [isOpen, toggle] = useToggle(props.modelValue);
const showMenu = ref(false);
const isAnimating = ref(false);

// Synchronisation avec v-model
syncRef(toRef(props, 'modelValue'), isOpen, { direction: 'both' });

// Classes d'animation selon le type et la direction
const getAnimationClasses = (entering: boolean) => {
  const baseClasses = {
    fade: entering ? 'animate__fadeIn' : 'animate__fadeOut',
    slide: entering
      ? props.placement.includes('top')
        ? 'animate__fadeInUp'
        : 'animate__fadeInDown'
      : props.placement.includes('top')
        ? 'animate__fadeOutUp'
        : 'animate__fadeOutDown',
    zoom: entering ? 'animate__zoomIn' : 'animate__zoomOut',
    bounce: entering ? 'animate__bounceIn' : 'animate__bounceOut',
  };

  return baseClasses[props.animationType];
};

const animationClass = computed(() => {
  if (isAnimating.value) {
    return getAnimationClasses(isOpen.value);
  }
  return '';
});

// Fonctions de contrôle avec animation
const open = () => {
  if (props.disabled || isAnimating.value) return;
  showMenu.value = true;
  isOpen.value = true;
  isAnimating.value = true;

  setTimeout(() => {
    isAnimating.value = false;
  }, 300); // Durée par défaut d'animate.css
};

const close = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  isOpen.value = false;

  // Attendre la fin de l'animation de sortie avant de masquer
  setTimeout(() => {
    showMenu.value = false;
    isAnimating.value = false;
  }, 300); // Durée par défaut d'animate.css
};

const handleToggle = () => {
  if (props.disabled || isAnimating.value) return;
  if (isOpen.value) {
    close();
  } else {
    open();
  }
};

// Positionnement du menu avec useElementBounding
const {
  top: triggerTop,
  left: triggerLeft,
  width: triggerWidth,
  height: triggerHeight,
} = useElementBounding(triggerRef);
const { width: menuWidth, height: menuHeight } =
  useElementBounding(floatingRef);

const menuStyles = computed(() => {
  if (!showMenu.value) return {};

  let top = 0;
  let left = 0;

  // Calcul de la position selon le placement
  switch (props.placement) {
    case 'bottom-start':
    case 'bottom':
      top = triggerTop.value + triggerHeight.value + props.offset;
      left = triggerLeft.value;
      break;
    case 'bottom-end':
      top = triggerTop.value + triggerHeight.value + props.offset;
      left = triggerLeft.value + triggerWidth.value - menuWidth.value;
      break;
    case 'top-start':
    case 'top':
      top = triggerTop.value - menuHeight.value - props.offset;
      left = triggerLeft.value;
      break;
    case 'top-end':
      top = triggerTop.value - menuHeight.value - props.offset;
      left = triggerLeft.value + triggerWidth.value - menuWidth.value;
      break;
  }

  // Ajustement si le menu sort du viewport
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  if (left + menuWidth.value > viewport.width) {
    left = viewport.width - menuWidth.value - 16;
  }
  if (left < 16) {
    left = 16;
  }
  if (top + menuHeight.value > viewport.height) {
    top = triggerTop.value - menuHeight.value - props.offset;
  }
  if (top < 16) {
    top = triggerTop.value + triggerHeight.value + props.offset;
  }

  return {
    position: 'fixed' as const,
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 50,
  };
});

// Fermeture au clic extérieur
onClickOutside(
  triggerRef,
  () => {
    if (isOpen.value && !isAnimating.value) close();
  },
  { ignore: [floatingRef] },
);

// Gestion des événements clavier
useEventListener('keydown', (e) => {
  if (!isOpen.value) return;

  if (e.key === 'Escape') {
    close();
    triggerRef.value?.focus();
  }
});

// Focus management simple
const { focused } = useFocus(floatingRef, { initialValue: false });

watch(isOpen, (newValue) => {
  if (newValue) {
    emit('open');
    nextTick(() => {
      focused.value = true;
    });
  } else {
    emit('close');
    focused.value = false;
  }
});

// Synchronisation avec la prop modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== isOpen.value) {
      if (newValue) {
        open();
      } else {
        close();
      }
    }
  },
);

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue);
});

// Initialisation
onMounted(() => {
  if (props.modelValue) {
    showMenu.value = true;
  }
});
</script>

<style lang="css" scoped>
.bh-dropdown {
  @apply relative inline-block;
}

.bh-dropdown__trigger {
  @apply cursor-pointer;
}

.bh-dropdown__trigger:focus {
  @apply outline-none;
}

.bh-dropdown__default-trigger {
  @apply flex items-center justify-between gap-2;
  @apply bg-dark-gray-500 text-warm-white-500;
  @apply px-4 py-2 rounded-lg;
  @apply border border-light-gray-700;
  @apply hover:bg-dark-gray-400 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-golden-yellow-500;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply min-w-[200px];
}

.bh-dropdown__arrow {
  @apply transition-transform duration-200;
  @apply shrink-0;
}

.bh-dropdown__arrow--open {
  @apply rotate-180;
}

.bh-dropdown__menu {
  @apply bg-dark-gray-500 rounded-2xl;
  @apply border border-light-gray-700;
  @apply shadow-xl;
  @apply min-w-[200px];
  @apply py-2;
  @apply z-50;
  /* Animation CSS personnalisée supprimée - utilise maintenant animate.css */
}

.bh-dropdown__default-content {
  @apply flex flex-col;
}

.bh-dropdown__item {
  @apply px-4 py-2;
  @apply text-warm-white-500;
  @apply hover:bg-dark-gray-400;
  @apply cursor-pointer;
  @apply transition-colors;
  @apply focus:outline-none focus:bg-dark-gray-400;
}

.bh-dropdown__item:hover,
.bh-dropdown__item:focus {
  @apply text-golden-yellow-500;
}

.bh-dropdown__item:first-child {
  @apply rounded-t-xl;
}

.bh-dropdown__item:last-child {
  @apply rounded-b-xl;
}

/* Personnalisation de la vitesse d'animate.css */
.bh-dropdown__menu.animate__animated {
  --animate-duration: 0.3s;
}
</style>
