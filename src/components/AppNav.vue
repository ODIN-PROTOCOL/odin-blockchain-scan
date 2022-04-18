<template>
  <div class="app-nav" :class="{ ['app-nav_mobile']: isOpen }">
    <div class="app-nav__wrap-cont">
      <LinksDropdown :list="BlockchainList" @redirect="changeRoute" />
      <LinksDropdown :list="TokenomicList" @redirect="changeRoute" />
      <LinksDropdown :list="ResourceList" @redirect="changeRoute" />
    </div>
    <UserWidget />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LinksDropdown from '@/components/LinksDropdown.vue'
import UserWidget from '@/components/UserWidget.vue'
import { LinkList } from '@/helpers/Types'

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
    const TokenomicList: LinkList = {
      name: 'Tokenomics',
      links: [
        {
          to: 'Tokenomics',
          text: 'Tokenomics overview',
        },
        {
          to: 'odin&geo',
          text: 'ODIN&GEO',
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

    return { BlockchainList, TokenomicList, ResourceList, changeRoute }
  },
})
</script>

<style lang="scss" scoped>
.app-nav {
  display: flex;
  width: 100%;
  align-items: center;

  &__wrap-cont {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    gap: 2.4rem;
  }
}

@include respond-to(tablet) {
  .app-nav {
    display: none;
    background: #fff;
    width: 100%;
    z-index: 1;
    height: calc(100vh - 8.4rem);
    padding: 2.4rem 1.6rem;
    border-top: 0.1rem solid var(--clr__table-border);

    &__wrap-cont {
      flex-direction: column;
      gap: 0;
      margin-bottom: 2.4rem;
    }

    &_mobile {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: fixed;
      top: 8.4rem;
      left: 0;
      overflow-y: auto;
    }
  }
}
</style>
