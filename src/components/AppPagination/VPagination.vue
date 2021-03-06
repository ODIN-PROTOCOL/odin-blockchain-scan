<template>
  <ul class="v-pagination">
    <li
      class="v-pagination__control"
      :class="{ ['v-pagination__control--active']: isPrevControlsActive }"
      @click="goToPrev"
    >
      <PaginationArrowIcon
        class="v-pagination__control-arrow rotate-left"
        :width="6"
        :height="10"
      />
    </li>
    <li>
      <input
        class="v-pagination__input"
        type="number"
        :min="1"
        :max="pages"
        :value="modelValue"
        :aria-label="`Page ${modelValue}`"
        @keydown.enter="goTo($event)"
        @blur="goTo($event)"
      />
    </li>
    <li class="v-pagination__total-page">
      <span>of {{ pages }}</span>
    </li>
    <li
      class="v-pagination__control"
      :class="{ ['v-pagination__control--active']: isNextControlsActive }"
      @click="goToNext"
    >
      <PaginationArrowIcon
        class="v-pagination__control-arrow rotate-right"
        :width="6"
        :height="10"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import PaginationArrowIcon from '@/components/icons/PaginationArrowIcon.vue'

export default defineComponent({
  name: 'VPagination',
  components: {
    PaginationArrowIcon,
  },
  props: {
    pages: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const isPrevControlsActive = computed((): boolean => {
      return props.modelValue > 1
    })
    const isNextControlsActive = computed((): boolean => {
      return props.modelValue < props.pages
    })
    function goToPrev(): void {
      if (isPrevControlsActive.value) {
        emit('update:modelValue', props.modelValue - 1)
      }
    }
    function goToNext(): void {
      if (isNextControlsActive.value) {
        emit('update:modelValue', props.modelValue + 1)
      }
    }
    function goTo(event: { target: { value: string | null } }): void {
      if (
        Number(event.target.value) > 0 &&
        Number(event.target.value) <= props.pages
      ) {
        emit('update:modelValue', Number(event.target.value))
      } else {
        emit('update:modelValue', 1)
      }
    }

    return {
      isPrevControlsActive,
      isNextControlsActive,
      goToPrev,
      goToNext,
      goTo,
    }
  },
})
</script>

<style scoped lang="scss">
.v-pagination {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.v-pagination__control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  border: 0.1rem solid var(--clr__input-border);
  fill: var(--clr__input-border);
}
.v-pagination__control--active {
  cursor: pointer;
  border: 0.1rem solid var(--clr__action);
  fill: var(--clr__action);
  svg {
    fill: var(--clr__action);
    transition: all 0.5s ease;
  }
  &:hover {
    svg {
      fill: var(--clr__btn-hover);
    }
    border-color: var(--clr__btn-hover);
  }
}
.v-pagination__control-arrow {
  position: absolute;
  display: block;
  width: 1rem;
  height: 1.2rem;
  margin: 0 0.2rem;
  fill: var(--clr__input-border);
}
.v-pagination__total-page {
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: 1.6rem;
  margin: 0 0.8rem;
}
.v-pagination__input {
  border: 0.1rem solid var(--clr__input-border);
  width: 6rem;
  height: 3.6rem;
  margin: 0 0.2rem;
  border-radius: 0.4rem;
  text-align: center;
  &:hover {
    border: 0.1rem solid var(--clr__action);
  }
}
.rotate-right {
  transform: rotate(180deg);
}
.rotate-left {
  transform: translateX(-0.3rem) rotate(0deg);
}
li {
  background: var(--clr__main-bg);
  border-radius: 0.4rem;
  margin: 0 0.2rem;
  min-width: 2.6rem;
  height: 3.6rem;
}
</style>
