<template>
  <div class="app-nav" :class="{ ['app-nav--mobile']: isOpen }">
    <div class="app-nav__wrap">
      <div class="app-nav__page">
        <LinksDropdown :list="BlockchainList" @redirect="changeRoute" />
        <LinksDropdown :list="ResourceList" @redirect="changeRoute" />
        <router-link
          @click="changeRoute"
          class="app-nav__link"
          data-text="IBCs"
          :to="{ name: 'IBC' }"
        >
          <span>IBCs</span>
        </router-link>
      </div>
      <div class="app-nav__switch">
        <a
          :class="{ ['app-nav__switch-item--active']: isMainnet }"
          class="app-nav__switch-item"
          :disabled="isMainnet"
          :href="START_VALUE.mainnetScan"
        >
          mainnet
        </a>
        <a
          :class="{ ['app-nav__switch-item--active']: !isMainnet }"
          class="app-nav__switch-item"
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

<script lang="ts">
import { defineComponent, computed } from 'vue'
import LinksDropdown from '@/components/LinksDropdown.vue'
import UserWidget from '@/components/UserWidget.vue'
import { LinkList } from '@/helpers/Types'
import { START_VALUE } from '@/api/api-config'

export default defineComponent({
  name: 'AppNav',
  components: {
    LinksDropdown,
    UserWidget,
  },
  props: {
    isOpen: { type: Boolean, default: false },
  },

  setup(_, { emit }) {
    const BlockchainList: LinkList = {
      name: 'Blockchain',
      links: [
        {
          to: 'Transactions',
          text: 'Transactions',
        },
        {
          to: 'Blocks',
          text: 'Blocks',
        },
        {
          to: 'Validators',
          text: 'Validators',
        },
        {
          to: 'TopAccounts',
          text: 'Top Accounts',
        },
      ],
    }

    const ResourceList: LinkList = {
      name: 'Resources',
      links: [
        {
          to: 'Chart&Stats',
          text: 'Charts & Stats',
        },
      ],
    }

    const changeRoute = () => {
      emit('changeRoute')
    }

    const isMainnet = computed(() => {
      return START_VALUE.server === 'mainnet'
    })

    return {
      BlockchainList,
      ResourceList,
      changeRoute,
      isMainnet,
      START_VALUE,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-nav__switch {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 11.8rem;
  height: 3.2rem;
  background: var(--clr__nav-switch-background);
  border-radius: 3.2rem;
  font-size: 1.2rem;
  line-height: 1.6rem;
  padding: 0.4rem;
  margin-right: 3.6rem;
}
.app-nav__wrap {
  display: flex;
  width: 100%;
  gap: 2.4rem;
  flex-direction: row;
  align-items: center;
}
.app-nav__switch-item {
  padding: 0.4rem 0.8rem;
  width: 5.8rem;
  height: 2.4rem;
  text-decoration: none;
  color: var(--clr__nav-switch-color);
  cursor: pointer;

  &--active {
    pointer-events: none;
    cursor: default;
    background: var(--clr__btn-normal);
    border-radius: 3.2rem;
    color: var(--clr__main-bg);
  }
}
.app-nav {
  display: flex;
  width: 100%;
  align-items: center;
}
.app-nav__page {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  gap: 2.4rem;
}
.app-nav__link {
  display: grid;
  grid-template-columns: 100%;
  text-decoration: none;
  white-space: nowrap;
  color: inherit;
  font-weight: 400;
  line-height: 2.4rem;
  font-size: 1.6rem;
  cursor: pointer;

  &:hover {
    color: var(--clr__action);
  }

  &::before {
    content: attr(data-text);
    font-weight: 900;
    opacity: 0;
    grid-column: 1;
    grid-row: 1;
  }
  > span {
    text-align: center;
    grid-column: 1;
    grid-row: 1;
    transition: color 0.5s ease, font-weight 0.5s ease;
  }
  &.router-link-exact-active > span {
    font-weight: bold;
    color: var(--clr__action);
  }
}

@include respond-to(tablet) {
  .app-nav__wrap {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  .app-nav {
    display: none;
    background: var(--clr__main-bg);
    width: 100%;
    z-index: 1;
    height: calc(100vh - 8.4rem);
    padding: 2.4rem 1.6rem;
    border-top: 0.1rem solid var(--clr__table-border);
  }
  .app-nav__page {
    flex-direction: column;
    gap: 0;
    margin-bottom: 2.4rem;
  }
  .app-nav__link {
    width: 100%;
    padding: 2.4rem 1.2rem;
    border-bottom: 0.1rem solid var(--clr__input-border);
    > span {
      text-align: left;
    }

    &:hover {
      background: var(--clr__dropdown-link);
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
    top: 8.4rem;
    left: 0;
    overflow-y: auto;
  }
}
</style>
