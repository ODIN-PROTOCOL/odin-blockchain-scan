<template>
  <a class="user-widget app__btn" :href="START_VALUE.walletLink">
    Stake ODIN
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { START_VALUE } from '@/api/api-config'

export default defineComponent({
  name: 'UserWidget',
  setup() {
    return { START_VALUE }
  },
})
</script>

<style scoped lang="scss">
.user-widget {
  width: 12.7rem;
  height: 3.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  line-height: 2.4rem;
  text-decoration: none;
}
@include respond-to(tablet) {
  .user-widget {
    width: 100%;
  }
}
</style>
