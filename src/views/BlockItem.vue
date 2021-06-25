<template>
  <div class="container">
    <div class="block-item">
      <div class="block-item__title">
        <button class="block-back" @click.prevent="back">
          <img src="~@/assets/icons/back-arrow.svg" alt="info" />
        </button>
        <h1 class="block-name">Block</h1>
        <span class="block-id">{{ route.params.id }}</span>
      </div>
      <div class="block-chars">
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                Also known as Block Number. The block height, which indicates
                the length of the blockchain, increases after the addition of
                the new block.
              </span>
              Block height:
            </div>
          </div>
          <div class="info-value">
            <span>{{ route.params.id }}</span>
            <div class="copy-button__wrapper">
              <button
                class="copy-button"
                @click.prevent="copyValue(route.params.id)"
              >
                <img src="~@/assets/icons/copy.svg" alt="info" />
              </button>
              <div class="tooltip">Copy From Block Hash to clipboard.</div>
            </div>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The hash of the block header of the current block.
              </span>
              Block hash:
            </div>
          </div>
          <div class="info-value text-blue">
            <span>0x{{ blockHash }}</span>
            <div class="copy-button__wrapper">
              <button
                class="copy-button"
                @click.prevent="copyValue('0x' + blockHash)"
              >
                <img src="~@/assets/icons/copy.svg" alt="info" />
              </button>
              <div class="tooltip">Copy From Block Hash to clipboard.</div>
            </div>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The hash of the block from which this block was generated, also
                known as its parent block.
              </span>
              Block parent hash:
            </div>
          </div>
          <div class="info-value text-blue">
            <span>0x{{ blockParentHash }}</span>
            <div class="copy-button__wrapper">
              <button
                class="copy-button"
                @click.prevent="copyValue('0x' + blockParentHash)"
              >
                <img src="~@/assets/icons/copy.svg" alt="info" />
              </button>
              <div class="tooltip">
                Copy From Block Parent Hash to clipboard.
              </div>
            </div>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The date and time at which a block is validated.
              </span>
              Timestamp:
            </div>
          </div>
          <div class="info-value">
            <span>{{ convertDate(blockInfo.block?.header.time) }}</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The number of transactions in the block.
              </span>
              Block’s transactions:
            </div>
          </div>
          <div class="info-value">
            <span>{{ blockSize?.value }}</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                Validator who successfully included the block onto the
                blockchain.
              </span>
              Block creator:
            </div>
          </div>
          <div class="info-value">
            <span>{{}}</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                For each block, the validator is rewarded with a finite amount
                of ODIN tokens on top of the fees paid for all transactions in
                the block.
              </span>
              Block reward:
            </div>
          </div>
          <div class="info-value">
            <span>{{}}</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The block size is actually determined by the block's gas limit.
              </span>
              Block size:
            </div>
          </div>
          <div class="info-value">
            <span>{{}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { callers } from '@/api/callers'
import { toHex } from '@cosmjs/encoding'

export default {
  // eslint-disable-next-line
  setup() {
    const router = useRouter()
    const back = () => {
      router.back()
    }
    const route = useRoute()

    const blockInfo = ref([])
    const blockSize = ref()
    const blockHash = ref()
    const blockParentHash = ref()

    const getBlock = async () => {
      const response = await callers.getClient()

      response.block(+route.params.id).then((res) => {

        blockInfo.value = res
        blockHash.value = getHash(blockInfo.value.blockId.hash)
        blockParentHash.value = getHash(
          blockInfo.value.block.header.lastBlockId.hash
        )
      })
    }

    const convertDate = (time) => {
      const nowTime = new Date()

      const newTime = new Date(time)

      const diff = (nowTime.getTime() - newTime.getTime()) / 1000
      let diffMinutes = ''
      let diffSeconds = ''
      let totalDiff = ''
      if (diff < 900) {
        if (diff / 60 > 0) {
          diffMinutes =
            parseInt(diff / 60) > 9
              ? parseInt(diff / 60) + ':'
              : '0' + parseInt(diff / 60) + ':'
          diffSeconds =
            parseInt(diff) - diffMinutes * 60 > 9
              ? parseInt(diff)
              : '0' + parseInt(diff)
        } else {
          diffMinutes = ''
          diffSeconds =
            parseInt(diff) > 9 ? parseInt(diff) : '0' + parseInt(diff)
        }

        totalDiff = `${diffMinutes}${diffSeconds} ago`
      }

      const timezone =
        newTime.getTimezoneOffset() / 60 != 0
          ? newTime.getTimezoneOffset() / 60 + ':00'
          : ''

      const seconds =
        newTime.getSeconds() > 9
          ? newTime.getSeconds()
          : '0' + newTime.getSeconds()
      const minutes =
        newTime.getMinutes() > 9
          ? newTime.getMinutes()
          : '0' + newTime.getMinutes()
      const hours =
        newTime.getHours() > 9 ? newTime.getHours() : '0' + newTime.getHours()
      const day =
        newTime.getDay() > 9 ? newTime.getDay() : '0' + newTime.getDay()
      const month =
        1 + newTime.getMonth() > 9
          ? 1 + newTime.getMonth()
          : '0' + (1 + newTime.getMonth())
      const year = newTime.getFullYear()
      const midday = hours > 12 ? 'PM' : 'AM'

      if (totalDiff) {
        return `${totalDiff} (${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${midday} ${timezone} UTC)`
      } else {
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${midday} ${timezone} UTC`
      }
    }

    const copyValue = (text) => {
      window.navigator.clipboard.writeText(text)
    }

    const getHash = (str) => {
      return toHex(str).toUpperCase()
    }

    onMounted(() => {
      getBlock()
    })

    return {
      blockInfo,
      route,
      blockSize,
      blockHash,
      back,
      copyValue,
      convertDate,
      blockParentHash,
    }
  },
}
</script>
<style lang="scss" scoped>
* {
  font-family: 'SF Display';
}
.block {
  &-item {
    padding: 2.6rem 3.3rem;

    &__title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 400;

      & > * {
        margin-right: 20px;
      }
    }

    @media screen and (max-width: 600px) {
      padding: 1.6rem;
    }
  }

  &-name {
    font-weight: 400;
    font-size: 32px;

    @media screen and (max-width: 600px) {
      font-size: 28px;
    }
  }

  &-row {
    display: flex;
    padding-bottom: 1.6rem;
    padding-top: 1.6rem;
    border-bottom: 1px solid #cce4ff;

    &__title {
      max-width: 209px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        display: block;
        margin-right: 9px;
      }
    }
  }

  &-id {
    text-overflow: ellipsis;
    max-width: 200px;
    font-size: 24px;
    font-weight: 400;
  }

  &-chars {
    padding-top: 1.9rem;

    .app-table__row {
      display: grid;
      grid-template-columns: 207px 1fr;
      padding: 1.6rem 0 1.6rem;

      @media screen and (max-width: 600px) {
        grid-template-columns: 150px 1fr;
      }
    }
  }

  &-back {
    min-width: 16px;
  }
}

.info {
  &-value {
    display: flex;
    align-items: center;

    @media screen and (max-width: 992px) {
      span {
        max-width: 250px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    @media screen and (max-width: 500px) {
      span {
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  &-key {
    display: flex;
    width: 207px;
    align-items: center;

    img {
      display: block;
      margin-right: 9px;
      cursor: pointer;
    }

    div {
      position: relative;
      display: flex;
    }

    @media screen and (max-width: 600px) {
      width: 150px;

      img {
        display: none;
      }
    }
  }
}

.text-blue {
  color: var(--clr__action);
}

.copy-button {
  display: block;
  margin-left: 10px;
  width: 13px;
  height: 15px;

  &__wrapper {
    position: relative;

    @media screen and (max-width: 1800px) {
      .tooltip {
        left: auto;
        right: -10px;
        bottom: 25px;

        &:before {
          right: 9px;
          left: auto;
          top: 50px;
        }
      }
    }
  }
}

.info-key__inner img:hover + .tooltip,
.copy-button:hover + .tooltip {
  opacity: 1;
}

.tooltip {
  opacity: 0;
  position: absolute;
  left: -29px;
  bottom: 25px;
  transition: all 0.15s ease;
  border-radius: 10px;
  white-space: nowrap;
  background: var(--clr__tooltip-new);
  padding: 12px 24px;
  color: #fff;
  pointer-events: none;
  z-index: 1;

  &:before {
    content: '';
    border-top: 10px solid var(--clr__tooltip-new);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    position: absolute;
    left: 35px;
    top: 51px;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 1300px) {
    left: auto;
    right: 0;
    top: -300%;

    &:before {
      left: 90%;
      top: 108%;
      border-top: 10px solid var(--clr__tooltip-new);
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: none;
    }
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.info-key__inner .tooltip {
  &:before {
    left: 27px;
  }
}
</style>
