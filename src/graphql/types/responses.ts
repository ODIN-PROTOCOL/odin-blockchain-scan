export interface AccountStakingInfoResponse {
  delegationBalance: {
    coins: { denom: string; amount: number }[]
  }
  stakingPool: {
    bonded: number
    unbonded: number
  }
}
