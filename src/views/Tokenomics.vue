<template>
  <div class="app__main-view tokenomics">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Tokenomics overview</h2>
    </div>
    <div class="tokenomics__content">
      <div class="tokenomics__content-nav">
        <button
          @click="changeTab(COINS.ODIN)"
          class="tokenomics__content-nav-item"
          :class="
            activeToken === COINS.ODIN
              ? 'tokenomics__content-nav-item_active'
              : ''
          "
        >
          ODIN
        </button>
        <button
          @click="changeTab(COINS.GEO)"
          class="tokenomics__content-nav-item"
          :class="
            activeToken === COINS.GEO
              ? 'tokenomics__content-nav-item_active'
              : ''
          "
        >
          GEO
        </button>
      </div>
      <div class="tokenomics__info">
        <div class="tokenomics__info-table-wrapper">
          <article class="tokenomics__info-table">
            <div
              class="tokenomics__info-table-row"
              v-for="(value, key) in activeTokenInfo"
              :key="key"
            >
              <div class="tokenomics__info-table-key">{{ key }}</div>
              <div class="tokenomics__info-table-values">
                <span v-for="(item, idx) in value" :key="idx">
                  {{ item }}
                </span>
              </div>
            </div>
          </article>

          <button
            @click="downloadPaper"
            class="app__btn tokenomics__info-table-btn"
          >
            Download Tokenomics Paper
          </button>
        </div>

        <div class="tokenomics__info-scheme">
          <img
            class="tokenomics__info-scheme-img"
            src="~@/assets/tokemonics.jpg"
            alt="tokemonics scheme"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

enum COINS {
  ODIN,
  GEO,
}

export default defineComponent({
  name: 'Tokenomics',
  setup() {
    const activeToken = ref(COINS.ODIN)
    const activeTokenInfo = computed(() => {
      return activeToken.value === COINS.ODIN ? ODIN_INFO : GEO_INFO
    })

    const downloadPaper = () => console.debug('download')

    const changeTab = (token: COINS) => {
      activeToken.value = token
    }

    const ODIN_INFO = {
      'Issuance model': ['at Genesis block'],
      'Distribution model': [
        'Data consumers pool - 10%;',
        'Staking and validator`s rewards - 30%;',
        'Company & Founding team - 10%;',
        'ODIN Treasury - 50%',
      ],
      'Supply power': [
        '100 million tokens (will be decreased to 80 million within the deflationary taxation program)',
      ],
      Purpose: [
        'Payment from data consumers;',
        'System Governance;',
        'System native token (validators, staking, fees)',
        'ODIN Treasury - 50%',
      ],
    }

    const GEO_INFO = {
      'Issuance model': ['at Genesis block'],
      'Distribution model': [
        'Data providers rewards - 14.5%;',
        'GEO`s investor`s token sale - 75.5%;',
        'Company & Founding team - 10%.',
      ],
      'Supply power': ['400 million tokens'],
      Purpose: ['Payment to data providers'],
    }

    return {
      COINS,
      changeTab,
      downloadPaper,
      activeToken,
      activeTokenInfo,
    }
  },
})
</script>

<style scoped lang="scss">
.tokenomics {
  &__content-nav {
    margin-bottom: 2.4rem;
  }

  &__content-nav-item {
    font-size: 2rem;
    padding: 1.2rem 2.4rem;
    box-shadow: inset 0 -0.2rem 0 rgb(0 123 255 / 16%);

    &_active {
      font-weight: 600;
      box-shadow: inset 0 -0.2rem 0 var(--clr__action);
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
  }

  &__info-table {
    max-width: 49.5rem;
    background: var(--clr__muted-bg);
    padding: 3.2rem 2.4rem;
    margin-bottom: 2.4rem;
  }

  &__info-table-row {
    display: flex;
    padding: 2.4rem 0;
    border-bottom: 0.1rem solid var(--clr__table-border);

    &:last-child {
      border: none;
    }
  }

  &__info-table-key {
    min-width: 18.4rem;
    font-weight: 300;
  }

  &__info-table-values {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  &__info-scheme {
    margin-left: 2.4rem;
  }
}

@include respond-to(medium) {
  .tokenomics {
    &__info {
      flex-direction: column;
      gap: 4rem;
    }

    &__info-table {
      max-width: 100%;
    }

    &__info-scheme {
      margin: 0;
    }

    &__info-scheme-img {
      margin: 0 auto;
    }
  }
}

@include respond-to(x-small) {
  .tokenomics {
    &__info-table-btn {
      width: 100%;
    }
  }
}
</style>
