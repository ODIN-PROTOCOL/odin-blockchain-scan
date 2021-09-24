<template>
  <div class="chart">
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :key="Component" :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

export default defineComponent({
  name: 'Chart',
  setup() {
    const chartData = ref<string>()
    const route: RouteLocationNormalizedLoaded = useRoute()

    onMounted(async (): Promise<void> => {
      chartData.value = 'asd'
    })

    return {
      chartData,
      route,
    }
  },
})
</script>

<style scoped></style>
