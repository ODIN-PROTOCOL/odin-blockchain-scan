<template>
  <div>
    <component :key="component" :is="component" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'

export default defineComponent({
  name: 'StatusIcon',
  props: {
    status: { type: String, required: true },
  },
  components: { SuccessIcon, ErrorIcon },
  setup(props) {
    const component = computed(() => {
      return props.status === 'success' ? 'SuccessIcon' : 'ErrorIcon'
    })

    return { component }
  },
})
</script>
