<template>
  <div class="blocks-container">
    <div class="view-main tokemonics">
      <div class="tokemonics-left">
        <div class="mg-b24 mg-t32">
          <div>
            <h1>Tokenomics overview</h1>
            <div class="mg-b16 mg-t32 tokemonics-nav">
              <h2
                class="view-title"
                @click="changeTab(true)"
                :class="showTab ? 'active' : ''"
              >
                ODIN
              </h2>
              <h2
                class="view-title"
                @click="changeTab(false)"
                :class="!showTab ? 'active' : ''"
              >
                GEO
              </h2>
            </div>
          </div>

          <div class="tokemonics-content">
            <article class="app-table" v-if="showTab">
              <div class="tokemonics-content__row">
                <div class="info-key">Issuance model</div>
                <div class="info-value">
                  <span>at Genesis block</span>
                </div>
              </div>
              <div class="tokemonics-content__row">
                <div class="info-key">Distribution model</div>
                <div class="info-value">
                  <span>Data consumers pool - 10%;</span>
                  <span>Staking and validator’s rewards - 30%;</span>
                  <span>Company & Founding team - 10%;</span>
                  <span>ODIN Treasury - 50%</span>
                </div>
              </div>
              <div class="tokemonics-content__row">
                <div class="info-key">Supply power</div>
                <div class="info-value">
                  <span
                    >100 million tokens (will be decreased to 80 million within
                    the deflationary taxation program)</span
                  >
                </div>
              </div>
              <div class="tokemonics-content__row">
                <div class="info-key">Purpose</div>
                <div class="info-value">
                  <span>Payment from data consumers;</span>
                  <span>System Governance;</span>
                  <span>System native token (validators, staking, fees)</span>
                  <span>ODIN Treasury - 50%</span>
                </div>
              </div>
            </article>
            <article class="app-table" v-if="!showTab">
              <div class="tokemonics-content__row">
                <div class="info-key">Issuance model</div>
                <div class="info-value">
                  <span>at Genesis block</span>
                </div>
              </div>
              <div class="tokemonics-content__row">
                <div class="info-key">Distribution model</div>
                <div class="info-value">
                  <span>Data providers rewards - 14.5%;</span>
                  <span>GEO’s investor’s token sale - 75.5%;</span>
                  <span>Company & Founding team - 10%.</span>
                </div>
              </div>
              <div class="tokemonics-content__row">
                <div class="info-key">Supply power</div>
                <div class="info-value">
                  <span>400 million tokens</span>
                </div>
              </div>
              <div class="tokemonics-content__row">
                <div class="info-key">Purpose</div>
                <div class="info-value">
                  <span>Payment to data providers </span>
                </div>
              </div>
            </article>
          </div>
        </div>
        <button @click="downloadPaper" class="tokemonics-download">
          Download Tokenomics Paper
        </button>
      </div>
      <div class="tokemonics-scheme">
        <img src="~@/assets/tokemonics.jpg" alt="tokemonics scheme" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

export default defineComponent({
  setup() {
    const showTab = ref(true)

    const downloadPaper = () => console.log('download')

    let timer = setInterval(() => {
      showTab.value = !showTab.value
    }, 20000)

    const changeTab = (state: boolean) => {
      showTab.value = state
      clearInterval(timer)
      timer = setInterval(() => {
        showTab.value = !showTab.value
      }, 20000)
    }

    return {
      changeTab,
      showTab,
      downloadPaper,
    }
  },
})
</script>

<style scoped lang="scss">
* {
  font-family: 'SF Display';
}

h1 {
  font-weight: 400;
  font-size: 32px;
  color: var(--clr__text);
}

h2 {
  font-weight: 400;
  font-size: 20px;
  color: var(--clr__text);
}

.tokemonics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;

  @media screen and (max-width: 1100px) {
    grid-template-columns: 1fr;
  }

  &-content {
    max-width: 500px;
    padding: 0.8rem 2.4rem;
    background: #f7f7f7;

    &__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 2.4rem 0;
    }

    &__row + &__row {
      border-top: 1px solid var(--clr__table-border);
    }

    @media screen and (max-width: 1100px) {
      max-width: 100%;
    }
  }

  &-download {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    width: 290px;
    height: 54px;
    background: var(--clr__action);
    border-radius: 4px;
    font-size: 20px;
    border: none;
    outline: none;

    &:focus,
    &:hover {
      outline: none;
    }

    @media screen and (max-width: 600px) {
      width: 100%;
    }
  }

  &-nav {
    display: flex;

    h2 {
      width: 97px;
      color: var(--clr__text);
      border-bottom: 2px solid rgba(0, 123, 255, 0.16);
      font-size: 2rem;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        border-bottom: 2px solid var(--clr__action);
        font-weight: 600;
      }
    }
  }

  &-scheme {
    padding-top: 177px;

    @media screen and (max-width: 1100px) {
      display: flex;
      justify-content: center;
      padding-top: 50px;
    }
  }
}

.blocks-container {
  border-top: 1px solid var(--clr__table-border);
}

.info {
  &-key {
    font-size: 14px;
  }

  &-value {
    span {
      font-size: 16px;
      display: block;
      line-height: 20px;

      & + span {
        margin-top: 16px;
      }
    }
  }
}
</style>
