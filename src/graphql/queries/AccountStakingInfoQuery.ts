import gql from 'graphql-tag'

export const AccountStakingInfoQuery = gql`
  query AccountStakingInfo($address: String!) {
    delegationBalance: action_delegation_total(address: $address) {
      coins
    }
    stakingPool: staking_pool {
      bonded: bonded_tokens
      unbonded: not_bonded_tokens
    }
    accountBalance: account_balance(where: { address: { _eq: $address } }) {
      lokiBalance: loki_balance
      minigeoBalance: mgeo_balance
    }
  }
`
