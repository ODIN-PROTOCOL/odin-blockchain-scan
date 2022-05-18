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
          progress > 60
            ? 'progressbar-tool__thumb_positive'
            : 'progressbar-tool__thumb_negative'
        "
        :style="`width: ${progress}%`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, computed } from 'vue'

export default defineComponent({
  name: 'progressbar-toolTool',
  props: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    current: { type: Number, required: true },
    isForValidators: { type: Boolean, default: false },
  },
  setup: function (props) {
    const _min = toRef(props, 'min')
    const _max = toRef(props, 'max')
    const _current = toRef(props, 'current')

    const progress = computed(() => {
      if (_current.value >= _max.value) return 100
      if (_current.value <= _min.value) return 5

      return Math.round((_current.value / _max.value) * 100)
    })
    return { progress }
  },
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
  background: var(--clr__progressbar-tool-track);
}

.progressbar-tool__thumb {
  width: 20%;
  height: 100%;
  border-radius: 0.4rem;

  &_positive {
    background: var(--clr__progressbar-tool-positive);
  }

  &_negative {
    background: var(--clr__progressbar-tool-negative);
  }
}
</style>
