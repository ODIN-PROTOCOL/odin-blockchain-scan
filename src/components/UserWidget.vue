<template>
  <a class="user-widget app-btn app-btn--medium" :href="START_VALUE.walletLink">
    Stake ODIN
  </a>
</template>

<script setup lang="ts">
import { START_VALUE } from '@/api/api-config'
</script>

<style scoped lang="scss">
.user-widget {
  width: 12.7rem;
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
