<template>
  <div>
    <div class="title">
      <BackButton :current-router="router" />
      <h1 class="title-name">Block Validators Chart</h1>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { callers } from '@/api/callers'
import { Pagination } from '@/api/query-ext/telemetryExtension'
import BackButton from '@/components/BackButton.vue'

export default defineComponent({
  name: 'ValidatorChart',
  components: { BackButton },
  setup() {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const pagination: Pagination = new Pagination(0, 10, true, true)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 2)

    const getValidatorsData = async (): Promise<void> => {
      console.log(
        await callers.getTopValidators({ startDate, endDate, pagination })
      )
    }

    onMounted(async (): Promise<void> => {
      try {
        await getValidatorsData()
      } catch (e) {
        console.error(e)
      }
    })

    return {
      router,
      route,
    }
  },
})
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: 2rem;
}
</style>
