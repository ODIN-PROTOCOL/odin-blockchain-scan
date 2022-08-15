import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import {
  MsgSubmitProposal,
  MsgVote,
  MsgDeposit,
} from '@provider/codec/cosmos/gov/v1beta1/tx'
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
import { MsgStoreCode } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { MsgCreateVestingAccount } from 'cosmjs-types/cosmos/vesting/v1beta1/tx.js'
import {
  MsgActivate,
  MsgAddReporter,
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgReportData,
  MsgRequestData,
  MsgEditOracleScript,
  MsgEditDataSource,
  MsgRemoveReporter,
} from '@provider/codec/oracle/v1/tx'
import {
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
  MsgFundCommunityPool,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx'
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { DecodedTxData } from '@/helpers/Types'
import {
  MsgCreateClient,
  MsgUpdateClient,
} from 'cosmjs-types/ibc/core/client/v1/tx'
import { MsgConnectionOpenInit } from 'cosmjs-types/ibc/core/connection/v1/tx'
import { MsgChannelOpenInit } from 'cosmjs-types/ibc/core/channel/v1/tx'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { MsgUnjail } from 'cosmjs-types/cosmos/slashing/v1beta1/tx'

export const getDecodeTx = (tx: TxResponse['tx']): Tx => Tx.decode(tx)

export function humanizeMessageType(type: string): string {
  switch (type) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return 'Withdraw'

    case '/cosmos.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgDeposit':
      return 'Deposit'

    case '/cosmos.gov.v1beta1.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return 'Submit Proposal'

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return 'Create Validator'

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return 'Delegate'

    case '/cosmos.bank.v1beta1.MsgSend':
      return 'Send'

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return 'Undelegate'

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return 'Edit Validator'

    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      return 'Begin Redelegate'

    case '/oracle.v1.MsgActivate':
      return 'Activate'

    case '/oracle.v1.MsgCreateDataSource':
      return 'Create Data Source'

    case '/oracle.v1.MsgCreateOracleScript':
      return 'Create Oracle Script'

    case '/oracle.v1.MsgAddReporter':
      return 'Add Reporter'

    case '/oracle.v1.MsgRequestData':
      return 'Request Data'

    case '/oracle.v1.MsgReportData':
      return 'Report Data'

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return 'Withdraw delegator reward'

    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return 'Withdraw validator commission'

    case '/cosmos.slashing.v1beta1.MsgUnjail':
      return 'Unjail'

    case '/ibc.core.client.v1.MsgCreateClient':
      return 'Create IBC Client'

    case '/ibc.core.connection.v1.MsgConnectionOpenInit':
      return 'Connection Open Init'

    case '/ibc.core.client.v1.MsgUpdateClient':
      return 'Update IBC Client'

    case '/ibc.core.channel.v1.MsgChannelOpenInit':
      return 'Chanel Open Init'

    case '/ibc.applications.transfer.v1.MsgTransfer':
      return 'IBC Transfer'

    case '/cosmos.vesting.v1beta1.MsgCreateVestingAccount':
      return 'Create Vesting Account'

    case '/oracle.v1.MsgEditDataSource':
      return 'Edit Data Source'

    case '/oracle.v1.MsgEditOracleScript':
      return 'Edit OracleScript'

    case '/oracle.v1.MsgRemoveReporter':
      return 'Remove Reporter'

    case '/mint.MsgMintCoins':
      return 'Mint Coins'

    case '/cosmos.distribution.v1beta1.MsgFundCommunityPool':
      return 'Fund Community Pool'

    case '/cosmwasm.wasm.v1.MsgStoreCode':
      return 'Store Code'

    default:
      throw new ReferenceError(`Unknown type ${type}`)
  }
}

export function decodeMessage(obj: {
  typeUrl: string
  value: Uint8Array
}):
  | MsgWithdrawCoinsToAccFromTreasury
  | MsgCreateValidator
  | MsgEditValidator
  | MsgDelegate
  | MsgUndelegate
  | MsgBeginRedelegate
  | MsgSend
  | MsgVote
  | MsgDeposit
  | MsgSubmitProposal
  | MsgAddReporter
  | MsgActivate
  | MsgCreateOracleScript
  | MsgCreateDataSource
  | MsgRequestData
  | MsgReportData
  | MsgCreateClient
  | MsgConnectionOpenInit
  | MsgUpdateClient
  | MsgChannelOpenInit
  | MsgTransfer
  | MsgWithdrawValidatorCommission
  | MsgUnjail
  | MsgCreateVestingAccount
  | MsgEditDataSource
  | MsgEditOracleScript
  | MsgFundCommunityPool
  | MsgRemoveReporter
  | MsgStoreCode {
  switch (obj.typeUrl) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/mint.MsgMintCoins':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return MsgCreateValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return MsgDelegate.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return MsgUndelegate.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgVote':
      return MsgVote.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgDeposit':
      return MsgDeposit.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return MsgSubmitProposal.decode(obj.value)

    case '/cosmos.bank.v1beta1.MsgSend':
      return MsgSend.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return MsgEditValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      return MsgBeginRedelegate.decode(obj.value)

    case '/oracle.v1.MsgActivate':
      return MsgActivate.decode(obj.value)

    case '/oracle.v1.MsgCreateDataSource':
      return MsgCreateDataSource.decode(obj.value)

    case '/oracle.v1.MsgEditDataSource':
      return MsgEditDataSource.decode(obj.value)

    case '/oracle.v1.MsgRemoveReporter':
      return MsgRemoveReporter.decode(obj.value)

    case '/oracle.v1.MsgCreateOracleScript':
      return MsgCreateOracleScript.decode(obj.value)

    case '/oracle.v1.MsgEditOracleScript':
      return MsgEditOracleScript.decode(obj.value)

    case '/oracle.v1.MsgAddReporter':
      return MsgAddReporter.decode(obj.value)

    case '/oracle.v1.MsgRequestData':
      return MsgRequestData.decode(obj.value)

    case '/oracle.v1.MsgReportData':
      return MsgReportData.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return MsgWithdrawDelegatorReward.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return MsgWithdrawValidatorCommission.decode(obj.value)

    case '/cosmos.slashing.v1beta1.MsgUnjail':
      return MsgUnjail.decode(obj.value)

    case '/ibc.core.client.v1.MsgCreateClient':
      return MsgCreateClient.decode(obj.value)

    case '/ibc.core.connection.v1.MsgConnectionOpenInit':
      return MsgConnectionOpenInit.decode(obj.value)

    case '/ibc.core.client.v1.MsgUpdateClient':
      return MsgUpdateClient.decode(obj.value)

    case '/ibc.core.channel.v1.MsgChannelOpenInit':
      return MsgChannelOpenInit.decode(obj.value)

    case '/ibc.applications.transfer.v1.MsgTransfer':
      return MsgTransfer.decode(obj.value)

    case '/cosmos.vesting.v1beta1.MsgCreateVestingAccount':
      return MsgCreateVestingAccount.decode(obj.value)

    case '/cosmwasm.wasm.v1.MsgStoreCode':
      return MsgStoreCode.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgFundCommunityPool':
      return MsgFundCommunityPool.decode(obj.value)
    default:
      throw new ReferenceError(`Unknown type ${obj.typeUrl}`)
  }
}

export function getDateFromMessage(tx: any): DecodedTxData {
  const DecodedTxData: DecodedTxData = {
    type: '',
    time: 0,
    fee: '0',
    amount: '',
    memo: '',
    status: 0,
    gasWanted: '',
    gasUsed: '',
  }
  if (tx) {
    const message = tx.messages[0]
    DecodedTxData.block = tx.height
    DecodedTxData.time = tx.block.timestamp
    DecodedTxData.type = humanizeMessageType(tx.messages[0]['@type'])
    DecodedTxData.fee = tx.fee.amount.length ? tx.fee.amount[0].amount : ''
    DecodedTxData.feeDenom = tx.fee.amount.length ? tx.fee.amount[0].denom : ''
    DecodedTxData.memo = tx?.memo ?? '<No Memo>'
    DecodedTxData.status = tx.success
    DecodedTxData.gasWanted = tx.gasWanted
    DecodedTxData.gasUsed = tx.gasUsed

    if ('amount' in message) {
      if (typeof message.amount === 'object') {
        if ('denom' in message.amount && 'amount' in message.amount) {
          DecodedTxData.amount = message.amount?.amount
          DecodedTxData.denom = message.amount?.denom
        } else {
          DecodedTxData.amount = message.amount[0]?.amount
          DecodedTxData.denom = message.amount[0]?.denom
        }
      }
    }

    if (DecodedTxData.type === 'Vote') {
      if ('voter' in message) {
        DecodedTxData.sender = message?.voter
      }
    }
    if (DecodedTxData.type === 'Delegate') {
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'Undelegate') {
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'Send') {
      if ('from_address' in message) {
        DecodedTxData.sender = message?.from_address
      }
      if ('to_address' in message) {
        DecodedTxData.receiver = message?.to_address
      }
    }
    if (DecodedTxData.type === 'Withdraw') {
      if ('sender' in message) {
        DecodedTxData.sender = message?.sender
      }
      if ('receiver' in message) {
        DecodedTxData.receiver = message?.receiver
      }
    }
    if (DecodedTxData.type === 'Withdraw delegator reward') {
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'Withdraw validator commission') {
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'Edit OracleScript') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Edit Data Source') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Edit Validator') {
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'Begin Redelegate') {
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegatorAddress
      }
      if ('validator_dst_address' in message) {
        DecodedTxData.receiver = message.validator_dst_address
      }
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'IBC Transfer') {
      if ('token' in message) {
        DecodedTxData.amount = message.token?.amount
        DecodedTxData.denom = message.token?.denom
      }
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
      if ('receiver' in message) {
        DecodedTxData.receiver = message.receiver
      }
    }
    if (DecodedTxData.type === 'Create Validator') {
      if ('delegator_address' in message) {
        DecodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'Submit Proposal') {
      if ('proposer' in message) {
        DecodedTxData.sender = message.proposer
      }
      if ('initial_deposit' in message) {
        DecodedTxData.amount = message.initial_deposit[0]?.amount
        DecodedTxData.denom = message.initial_deposit[0]?.denom
      }
    }
    if (DecodedTxData.type === 'Report Data') {
      if ('reporter' in message) {
        DecodedTxData.sender = message.reporter
      }
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
    }
    if (DecodedTxData.type === 'Request Data') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
    }
    if (DecodedTxData.type === 'Update IBC Client') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
      if ('validator_address' in message) {
        DecodedTxData.receiver = message.validator_address
      }
    }
    if (DecodedTxData.type === 'Create Oracle Script') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Create Data Source') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Create IBC Client') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
    }
    if (DecodedTxData.type === 'Connection Open Init') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
    }
    if (DecodedTxData.type === 'Create Vesting Account') {
      if ('from_address' in message) {
        DecodedTxData.sender = message.from_address
      }
      if ('to_address' in message) {
        DecodedTxData.receiver = message.to_address
      }
    }
    if (DecodedTxData.type === 'Unjail') {
      if ('validator_addr' in message) {
        DecodedTxData.receiver = message.validator_addr
      }
    }
    if (DecodedTxData.type === 'Chanel Open Init') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
    }
    if (DecodedTxData.type === 'Activate') {
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
    }
    if (DecodedTxData.type === 'Deposit') {
      if ('depositor' in message) {
        DecodedTxData.receiver = message.depositor
      }
    }
    if (DecodedTxData.type === 'Mint Coins') {
      if ('sender' in message) {
        DecodedTxData.sender = message?.sender
      }
      if ('receiver' in message) {
        DecodedTxData.receiver = message?.receiver
      }
    }

    if (DecodedTxData.type === 'Fund Community Pool') {
      if ('depositor' in message) {
        DecodedTxData.sender = message?.depositor
      }
    }

    if (DecodedTxData.type === 'Remove Reporter') {
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
      if ('reporter' in message) {
        DecodedTxData.sender = message.reporter
      }
    }

    if (DecodedTxData.type === 'Store Code') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
  }
  return DecodedTxData
}
