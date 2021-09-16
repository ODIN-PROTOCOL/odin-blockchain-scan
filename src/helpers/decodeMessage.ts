import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import { MsgVote } from '@provider/codec/cosmos/gov/v1beta1/tx'

export function humanizeMessageType(type: string): string {
  switch (type) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return 'Withdraw'

    case '/cosmos.MsgVote':
      return 'Vote'

    default:
      throw new ReferenceError(`Unknown type ${type}`)
  }
}

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

function decodeMessage(obj: {
  typeUrl: string
  value: Uint8Array
}): MsgWithdrawCoinsToAccFromTreasury | MsgVote {
  switch (obj.typeUrl) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/cosmos.MsgVote':
      return MsgVote.decode(obj.value)

    default:
      throw new ReferenceError(`Unknown type ${obj.typeUrl}`)
  }
}

export function getDateFromMessage(obj: {
  typeUrl: string
  value: Uint8Array
}): any {
  return { ...decodeMessage(obj), type: humanizeMessageType(obj.typeUrl) }
}
