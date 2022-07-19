import { callers } from '@/api/callers'
import { Modify } from '@/shared-types'
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { ValidatorsInfo } from '@/graphql/types'

export enum VALIDATOR_STATUS {
  inactive = 1,
  bounding = 2,
  active = 3,
}

export type ValidatorDecoded = Modify<Validator, { consensusPubkey?: string }>
export type ValidatorInfoModify = Modify<
  ValidatorsInfo,
  { isActive?: boolean; rank: number; uptime: number }
>

export const isActiveValidator = async (
  validatorAddress: string
): Promise<boolean> => {
  const response = await callers
    .getValidatorStatus(validatorAddress)
    .then((req) => req.status?.isActive)
  return Boolean(response)
}
