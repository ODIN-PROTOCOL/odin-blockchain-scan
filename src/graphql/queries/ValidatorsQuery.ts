import gql from 'graphql-tag'

export const ValidatorsQuery = gql`
  query Validators {
    stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
      bondedTokens: bonded_tokens
    }
    slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
      params
    }
    validator(order_by: { validator_info: { delegated_amount: desc } }) {
      info: validator_info {
        delegatedAmount: delegated_amount
        operatorAddress: operator_address
        delegatorShares: delegator_shares
        maxRate: max_rate
        maxChangeRate: max_change_rate
        validatorAddress: consensus_address
      }
      statuses: validator_statuses(order_by: { height: desc }, limit: 1) {
        status
        jailed
        tombstoned
      }
      votingPowers: validator_voting_powers(
        offset: 0
        limit: 1
        order_by: { height: desc }
      ) {
        votingPower: voting_power
      }
      commissions: validator_commissions(order_by: { height: desc }, limit: 1) {
        commission
        minSelfDelegation: min_self_delegation
      }
      signingInfos: validator_signing_infos(
        order_by: { height: desc }
        limit: 1
      ) {
        missedBlocksCounter: missed_blocks_counter
        tombstoned
      }
      descriptions: validator_descriptions {
        moniker
        details
      }
    }
  }
`
