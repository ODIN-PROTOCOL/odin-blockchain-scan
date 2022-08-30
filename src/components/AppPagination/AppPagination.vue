<template>
  <div class="app-pagination__wrapper">
    <div class="app-pagination">
      <button
        class="app-btn app-btn--medium app-pagination__control app-pagination__border"
        :class="{ 'app-pagination__control--active': isPrevControlsActive }"
        @click="goToPreviousPage"
      >
        <PaginationArrowIcon
          class="app-pagination__control-arrow rotate-left"
          :width="6"
          :height="10"
        />
      </button>
      <div>
        <input
          class="app-pagination__input app-pagination__border"
          type="number"
          :min="1"
          :max="pages"
          :value="modelValue"
          :aria-label="`Page ${modelValue}`"
          @keydown.enter="goToSelectedPage($event)"
          @blur="goToSelectedPage($event)"
        />
      </div>
      <div class="app-pagination__total-page">
        <span>of {{ pages }}</span>
      </div>
      <button
        class="app-btn app-btn--medium app-pagination__control app-pagination__border"
        :class="{ 'app-pagination__control--active': isNextControlsActive }"
        @click="goToNextPage"
      >
        <PaginationArrowIcon
          class="app-pagination__control-arrow rotate-right"
          :width="6"
          :height="10"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PaginationArrowIcon } from '@/components/icons'

enum EVENTS {
  updateModelValue = 'update:model-value',
}

const emit = defineEmits<{
  (e: EVENTS.updateModelValue, payload: number | string | undefined): void
}>()

const props = defineProps<{
  modelValue: number
  pages: number
}>()

const isPrevControlsActive = computed((): boolean => {
  return props.modelValue > 1
})
const isNextControlsActive = computed((): boolean => {
  return props.modelValue < props.pages
})
function goToPreviousPage(): void {
  if (isPrevControlsActive.value) {
    emit(EVENTS.updateModelValue, props.modelValue - 1)
  }
}
function goToNextPage(): void {
  if (isNextControlsActive.value) {
    emit(EVENTS.updateModelValue, props.modelValue + 1)
  }
}
function goToSelectedPage(event: { target: { value: string } }): void {
  if (Number(event.target.value) === props.modelValue) return
  if (
    Number(event.target.value) > 0 &&
    Number(event.target.value) <= props.pages
  ) {
    emit(EVENTS.updateModelValue, Number(event.target.value))
  } else {
    emit(EVENTS.updateModelValue, 1)
  }
}
</script>

<style scoped lang="scss">
.app-pagination {
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  color: var(--clr-text);
  list-style-type: none;
}

.app-pagination__wrapper {
  max-height: 3.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-pagination__control {
  width: 3.6rem;
  height: 3.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: var(--clr__white);

  &--active {
    fill: var(--clr__azureish-white);
    cursor: pointer;

    svg {
      fill: var(--clr__white);
      transition: all 0.5s ease;
    }

    &:hover {
      svg {
        fill: var(--clr__white);
      }
    }
  }
}

.app-pagination__control-arrow {
  position: absolute;
  display: block;
  width: 1rem;
  height: 1.2rem;
  margin: 0 0.2rem;
  fill: var(--clr__white);
}

.app-pagination__total-page {
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: 1.6rem;
  margin: 0 0.8rem;
}

.app-pagination__border {
  min-width: 2.6rem;
  height: 3.6rem;
  margin: 0 0.2rem;
  border-radius: 0.4rem;
}

.app-pagination__input {
  width: 6rem;
  height: 3.6rem;
  margin: 0 0.2rem;
  border: 1px solid var(--clr__input-border);
  border-radius: 0.4rem;
  background-color: var(--clr__input-bg);
  text-align: center;
}

.rotate-right {
  transform: rotate(180deg);
}

.rotate-left {
  transform: translateX(-0.3rem) rotate(0deg);
}
</style>
