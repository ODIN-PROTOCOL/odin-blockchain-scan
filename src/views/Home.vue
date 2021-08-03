<template>
  <div class="home">
    <div class="home__wrapper">
      <div class="info-panel">info-panel</div>
      <Latest />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Latest from '@/components/LatestList/Latest.vue'

export default defineComponent({
  components: { Latest },
})
</script>

<style scoped lang="scss">
.home {
  &__wrapper {
    padding: 0 1rem;
    margin: 0 10.3rem;
  }
}
.info-panel {
  //  TODO: temp this
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid #007bff;
  width: 100%;
  margin-bottom: 3.2rem;
}
</style>
