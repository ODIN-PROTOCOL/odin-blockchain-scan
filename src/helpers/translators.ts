import { BondStatus } from 'cosmjs-types/cosmos/staking/v1beta1/staking'

export function translateBondStatus(bondStatus: BondStatus): string {
  switch (Number(bondStatus)) {
    case BondStatus.BOND_STATUS_UNSPECIFIED:
      return 'Unspecified'
    case BondStatus.BOND_STATUS_UNBONDED:
      return 'Unbonded'
    case BondStatus.BOND_STATUS_UNBONDING:
      return 'Unbonding'
    case BondStatus.BOND_STATUS_BONDED:
      return 'Bonded'
    case BondStatus.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}
