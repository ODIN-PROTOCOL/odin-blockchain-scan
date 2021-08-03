<template>
  <div class="home">
    <div class="home__wrapper">
      <InfoPanel />
      <Latest />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Latest from '@/components/LatestList/Latest.vue'
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue'

export default defineComponent({
  name: 'Home Page',
  components: { Latest, InfoPanel },
})
</script>

<style scoped lang="scss">
.home {
  &__wrapper {
    padding: 0 1rem;
    margin: 0 10.3rem;
  }
}
</style>
