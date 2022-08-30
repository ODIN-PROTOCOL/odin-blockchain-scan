<template>
  <div class="theme-switch">
    <button
      :class="[
        'theme-switch__btn',
        currentTheme === ThemeMode.Dark ? 'theme-switch__btn--active' : '',
      ]"
      @click="toggleTheme(ThemeMode.Dark)"
    >
      <theme-dark />
    </button>
    <button
      :class="[
        'theme-switch__btn',
        currentTheme === ThemeMode.Light ? 'theme-switch__btn--active' : '',
      ]"
      @click="toggleTheme(ThemeMode.Light)"
    >
      <theme-light />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ThemeDark, ThemeLight } from '@/components/icons'
import { Theme, ThemeMode } from '@/helpers/theme'

const currentTheme = ref<string>(Theme.getTheme())

const toggleTheme = (theme: ThemeMode): void => {
  Theme.setTheme(theme)
  currentTheme.value = theme
}
</script>

<style lang="scss" scoped>
.theme-switch {
  display: flex;
  background-color: var(--clr__theme-switch-bg);
  border-radius: 3.2rem;
}

.theme-switch__btn {
  width: 3.2rem;
  height: 3.2rem;
  margin: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:first-child {
    margin-right: 0;
  }

  &::v-deep path {
    fill: var(--clr__theme-switch);
  }
}

.theme-switch__btn--active {
  background-color: var(--clr__theme-switch-active-bg);

  &::v-deep path {
    fill: var(--clr__theme-switch-active);
  }
}
</style>
