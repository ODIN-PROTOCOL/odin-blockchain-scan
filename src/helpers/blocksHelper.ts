import { BlockMeta } from '@cosmjs/tendermint-rpc'
import { Bech32 } from '@cosmjs/encoding'
import { callers } from '@/api/callers'

interface TransformedBlocks extends BlockMeta {
  validator: string
  txs: number
}

export const prepareBlocks = async (
  blocks: readonly BlockMeta[]
): Promise<TransformedBlocks[]> => {
  const transformedBlocks = await Promise.all(
    blocks.map(async (item: BlockMeta) => {
      const addData = await callers.getBlock(item.header.height)
      return {
        ...item,
        validator: Bech32.encode('odinvaloper', item.header.proposerAddress),
        txs: addData.block.txs.length,
      }
    })
  )

  return transformedBlocks
}
