import gql from 'graphql-tag'

export const AccountTransactionsQuery = gql`
  query AccountTransactions(
    $limit: Int!
    $offset: Int!
    $address: String!
    $type: String_comparison_exp = {}
  ) {
    message(
      limit: $limit
      offset: $offset
      order_by: { height: desc }
      where: { transaction: { sender: { _eq: $address } }, type: $type }
    ) {
      transaction_hash
      type
      value
      involved_accounts_addresses
      transaction {
        fee
        gasUsed: gas_used
        gasWanted: gas_wanted
        hash
        height
        memo
        messages
        partitionId: partition_id
        rawLog: raw_log
        sender
        signerInfos: signer_infos
        success
        signatures
        block {
          timestamp
          hash
        }
      }
    }
  }
`
