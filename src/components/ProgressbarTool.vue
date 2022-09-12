<template>
  <div class="progressbar-tool">
    <div class="progressbar-tool__info" v-if="isForValidators">
      <span class="progressbar-tool__info-item">{{ current }} %</span>
    </div>
    <div class="progressbar-tool__info" v-else>
      <span class="progressbar-tool__info-item">Min {{ min }}</span>
      <span class="progressbar-tool__info-item"
        >{{ current }} of {{ max }}</span
      >
    </div>
    <div class="progressbar-tool__track">
      <div
        class="progressbar-tool__thumb"
        :class="
          progress >= 60
            ? 'progressbar-tool__thumb--positive'
            : 'progressbar-tool__thumb--negative'
        "
        :style="`width: ${progress}%`"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    min: number
    max: number
    current: number
    isForValidators?: boolean
  }>(),
  { isForValidators: false },
)

const progress = computed(() => {
  if (props.current >= props.max) return 100
  if (props.current <= props.min) return 5
  return Math.round((props.current / props.max) * 100)
})
</script>

<style lang="scss" scoped>
.progressbar-tool {
  width: 16.8rem;
}

.progressbar-tool__info {
  display: flex;
  justify-content: space-between;
}

.progressbar-tool__info-item {
  font-size: 1.2rem;
  line-height: 1.6rem;
  text-transform: uppercase;
}

.progressbar-tool__track {
  width: 100%;
  height: 0.8rem;
  border-radius: 0.4rem;
  background: var(--clr__progressbar-track);
}

.progressbar-tool__thumb {
  width: 20%;
  height: 100%;
  border-radius: 0.4rem;

  &--positive {
    background: var(--clr__progressbar-positive);
  }

  &--negative {
    background: var(--clr__progressbar-negative);
  }
}
</style>
