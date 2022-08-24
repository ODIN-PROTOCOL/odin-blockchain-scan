<template>
  <div class="app-nav" :class="{ ['app-nav--mobile']: isOpen }">
    <div class="app-nav__wrap">
      <div class="app-nav__page">
        <LinksDropdown
          :is-dropdown-open="isBlockchainDropdownOpen"
          :list="BlockchainList"
          @click="openDropdownBlockchain"
          @redirect="closeBurger"
        />
        <LinksDropdown
          :is-dropdown-open="isResourceDropdownOpen"
          :list="ResourceList"
          @click="openDropdownResource"
          @redirect="closeBurger"
        />
        <router-link
          class="app-nav__link"
          data-text="IBCs"
          :to="{ name: $routes.ibc }"
          @click="closeBurger"
        >
          <span>IBCs</span>
        </router-link>
      </div>
      <div class="app-nav__switch">
        <a
          class="app-nav__switch-item"
          :class="{ 'app-nav__switch-item--active': isMainnet }"
          :disabled="isMainnet"
          :href="START_VALUE.mainnetScan"
        >
          mainnet
        </a>
        <a
          class="app-nav__switch-item"
          :class="{ 'app-nav__switch-item--active': !isMainnet }"
          :disabled="!isMainnet"
          :href="START_VALUE.testnetScan"
        >
          testnet
        </a>
      </div>
    </div>
    <UserWidget class="app-nav__user-widget" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import LinksDropdown from '@/components/LinksDropdown.vue'
import UserWidget from '@/components/UserWidget.vue'
import { LinkList } from '@/helpers/Types'
import { START_VALUE } from '@/api/api-config'
import { isMobile } from '@/helpers/helpers'
import { ROUTE_NAMES } from '@/enums'

enum EVENTS {
  closeBurger = 'close-burger',
}

withDefaults(
  defineProps<{
    isOpen?: boolean
  }>(),
  {
    isOpen: false,
  },
)

const BlockchainList: LinkList = {
  name: 'Blockchain',
  links: [
    {
      name: ROUTE_NAMES.transactions,
      text: 'Transactions',
    },
    {
      name: ROUTE_NAMES.blocks,
      text: 'Blocks',
    },
    {
      name: ROUTE_NAMES.validators,
      text: 'Validators',
    },
    {
      name: ROUTE_NAMES.accounts,
      text: 'Top Accounts',
    },
  ],
}

const emit = defineEmits<{
  (e: EVENTS.closeBurger): void
}>()

const ResourceList: LinkList = {
  name: 'Resources',
  links: [
    {
      name: ROUTE_NAMES.charts,
      text: 'Charts & Stats',
    },
  ],
}

const isBlockchainDropdownOpen = ref(false)
const isResourceDropdownOpen = ref(false)

const closeBurger = () => {
  emit(EVENTS.closeBurger)
}

const openDropdownResource = () => {
  if (isMobile()) {
    isResourceDropdownOpen.value = !isResourceDropdownOpen.value
    isBlockchainDropdownOpen.value = false
  }
}

const openDropdownBlockchain = () => {
  if (isMobile()) {
    isBlockchainDropdownOpen.value = !isBlockchainDropdownOpen.value
    isResourceDropdownOpen.value = false
  }
}

const isMainnet = computed(() => {
  return START_VALUE.server === 'mainnet'
})
</script>

<style lang="scss" scoped>
.app-nav {
  width: 100%;
  display: flex;
  align-items: center;
}

.app-nav__wrap {
  width: 100%;
  display: flex;
}

.app-nav__page {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2.4rem;
  color: var(--clr__bright-gray);
}

.app-nav__link {
  display: grid;
  grid-template-columns: 100%;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 2.4rem;
  cursor: pointer;

  &:hover {
    color: var(--clr__secondary);
  }

  &::before {
    content: attr(data-text);
    grid-column: 1;
    grid-row: 1;
    font-weight: 600;
    opacity: 0;
  }
  > span {
    grid-column: 1;
    grid-row: 1;
    text-align: center;
    transition: color 0.5s ease, font-weight 0.5s ease;
  }

  &.router-link-exact-active > span {
    color: var(--clr__secondary);
  }
}

.app-nav__switch {
  height: 4rem;
  margin-right: 2.5rem;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--clr__primary);
  border-radius: 3.2rem;
  font-size: 1.2rem;
  line-height: 1.6rem;
}

.app-nav__switch-item {
  width: 6.8rem;
  height: 3.2rem;
  padding: 0.8rem;
  color: var(--clr__silver-sand);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.app-nav__switch-item--active {
  pointer-events: none;
  background: var(--clr__secondary);
  color: var(--clr__white);
  border-radius: 3.2rem;
  cursor: default;
}

@include respond-to(tablet) {
  .app-nav {
    display: none;
    background: var(--clr__dark);
    width: 100%;
    z-index: 1;
    height: calc(100vh - 8.4rem);
    padding: 2.4rem 1.6rem;
    border-top: 0.1rem solid var(--clr__white);
  }

  .app-nav__wrap {
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  .app-nav__page {
    flex-direction: column;
    gap: 0;
    margin-bottom: 2.4rem;
  }

  .app-nav__link {
    width: 100%;
    padding: 2.4rem 1.2rem;
    border-bottom: 0.1rem solid var(--clr__white);
    > span {
      text-align: left;
    }

    &:hover {
      background: var(--clr__levender-blue);
    }

    &:first-child {
      padding: 2.4rem 1.2rem;
    }
  }

  .app-nav--mobile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 7.6rem;
    left: 0;
    overflow-y: auto;
    z-index: 10;
  }
}
</style>
