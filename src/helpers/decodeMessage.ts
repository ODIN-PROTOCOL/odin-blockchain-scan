import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import { MsgVote } from '@provider/codec/cosmos/gov/v1beta1/tx'
import {
  MsgCreateValidator,
  MsgDelegate,
  MsgUndelegate,
} from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { callers } from '@/api/callers'
import { ReadonlyDateWithNanoseconds } from '@cosmjs/tendermint-rpc/build/dates'
import { Tx } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'

const getDecodeTx = (tx) => Tx.decode(tx)

const getTime = async (
  height: number
): Promise<ReadonlyDateWithNanoseconds> => {
  const res = await callers.getBlockchain(height, height)
  return res.blockMetas[0].header.time
}

type adjustedData = {
  voter?: string
  type?: string
  delegatorAddress?: string
  time?: Date | undefined | string
  sender?: string
  receiver?: string
  amount?: string | Coin | Array<Coin> | undefined
  fee?: string
}

export function humanizeMessageType(type: string): string {
  switch (type) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return 'Withdraw'

    case '/cosmos.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgVote':
      return 'Vote'

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return 'Create Validator'

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return 'Delegate'

    case '/cosmos.bank.v1beta1.MsgSend':
      return 'Send'

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return 'Undelegate'

    default:
      throw new ReferenceError(`Unknown type ${type}`)
  }
}

/*
// if ('voter' in res.message) {
//   res.message.voter
// }

// export function decodeMessage(obj: {
//   type: '/mint.MsgWithdrawCoinsToAccFromTreasury'
//   value: Uint8Array
// }): MsgWithdrawCoinsToAccFromTreasury
// export function decodeMessage(obj: {
//   type: '/cosmos.MsgVote'
//   value: Uint8Array
// }): MsgVote
// export function decodeMessage(obj: {
//   type: '/cosmos.gov.v1beta1.MsgVote'
//   value: Uint8Array
// }): MsgVote
// export function decodeMessage(obj: {
//   type: '/cosmos.staking.v1beta1.MsgCreateValidator'
//   value: Uint8Array
// }): MsgCreateValidator
// export function decodeMessage(obj: {
//   type: '/cosmos.staking.v1beta1.MsgDelegate'
//   value: Uint8Array
// }): MsgDelegate
// export function decodeMessage(obj: {
//   type: '/cosmos.staking.v1beta1.MsgUndelegate'
//   value: Uint8Array
// }): MsgUndelegate
*/

function decodeMessage(obj: {
  typeUrl: string
  value: Uint8Array
}):
  | MsgWithdrawCoinsToAccFromTreasury
  | MsgCreateValidator
  | MsgDelegate
  | MsgUndelegate
  | MsgSend
  | MsgVote {
  switch (obj.typeUrl) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return MsgCreateValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return MsgDelegate.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return MsgUndelegate.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgVote':
      return MsgVote.decode(obj.value)

    case '/cosmos.bank.v1beta1.MsgSend':
      return MsgSend.decode(obj.value)

    default:
      throw new ReferenceError(`Unknown type ${obj.typeUrl}`)
  }
}

export async function getDateFromMessage(
  tx: TxResponse
): Promise<adjustedData> {
  const obj = getDecodeTx(tx.tx)?.body?.messages[0] as {
    typeUrl: string
    value: Uint8Array
  }
  const message = decodeMessage(obj)

  const adjustedData: adjustedData = {
    type: humanizeMessageType(obj.typeUrl),
    time: (await getTime(Number(tx.height))) as Date,
    fee: getDecodeTx(tx.tx)?.authInfo?.fee?.amount[0]?.amount,
  }

  if ('voter' in message) {
    adjustedData.sender = message?.voter
  }
  if (adjustedData.type === 'Delegate') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message?.validatorAddress
    }
  }
  if (adjustedData.type === 'Undelegate') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = ''
    }
  }
  if (adjustedData.type === 'Create Validator') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('value' in message) {
      adjustedData.amount = `${message?.value?.amount} ${message?.value?.denom}`
    }
  }
  if (adjustedData.type === 'Send') {
    if ('fromAddress' in message) {
      adjustedData.sender = message?.fromAddress
    }
    if ('toAddress' in message) {
      adjustedData.receiver = message?.toAddress
    }
  }
  if ('amount' in message) {
    if (typeof message.amount === 'object') {
      if ('denom' in message.amount && 'amount' in message.amount)
        adjustedData.amount = `${message.amount?.amount} ${message.amount.denom}`
    }
  }

  return adjustedData
}
