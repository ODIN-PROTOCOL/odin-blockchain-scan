<template>
  <!-- :title="title || text" -->
  <a :href="link">
    {{ text }}
  </a>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'

export default defineComponent({
  props: {
    text: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: [String, Number],
      required: false,
    },
    link: {
      type: [String],
      required: false,
    },
  },
  setup(props) {
    onMounted(() => {
      console.log('props',props.text)
    })
  }
})
</script>

<style scoped lang="scss">
a {
  color: var(--clr__action);
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
}
</style>
