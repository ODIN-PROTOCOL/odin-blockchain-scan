<template>
  <div class="info-icon">
    <img class="info-icon__img" src="~@/assets/icons/info.svg" alt="info" />
    <span class="info-icon__message">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  message: string
}>()
</script>

<style lang="scss" scoped>
.info-icon {
  height: 2.3rem;
  margin-right: 0.9rem;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;

  &:hover {
    .info-icon__message {
      display: block;
    }
  }
}

.info-icon__img {
  max-width: unset;
  width: 1.5rem;
}

.info-icon__message {
  min-width: 30rem;
  padding: 1.2rem 2.4rem;
  display: none;
  position: absolute;
  bottom: 130%;
  left: -50%;
  background: var(--clr__secondary);
  color: var(--clr__white);
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;

  &:before {
    content: '';
    width: 0.6rem;
    height: 0.6rem;
    display: block;
    position: absolute;
    bottom: -0.3rem;
    left: 1.6rem;
    background: var(--clr__secondary);
    transform: translateX(-50%) rotate(45deg);
  }
}
</style>
