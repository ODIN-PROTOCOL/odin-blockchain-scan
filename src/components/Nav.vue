<template>
  <div class="nav" :class="{ 'nav-mob': isOpen }">
    <div class="nav__wrap-cont">
      <LinksDropdown :list="BlockchainList" @redirect="changeRoute" />
      <LinksDropdown :list="TokemonicList" @redirect="changeRoute" />
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
  name: 'Nav',
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
        // {
        //   to: 'PendingTransactions',
        //   text: 'Pending Transactions',
        // },
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
    const TokemonicList: LinkList = {
      name: 'Tokemonics',
      links: [
        {
          to: 'Tokemonics',
          text: 'Tokemonics overview',
        },
        // TODO: return hide date when pages be done
        // {
        //   to: 'odin&geo',
        //   text: 'Odin & Geo',
        // },
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

    return { BlockchainList, TokemonicList, ResourceList, changeRoute }
  },
})
</script>
