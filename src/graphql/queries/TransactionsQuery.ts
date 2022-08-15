import gql from 'graphql-tag'

export const TransactionsQuery = gql`
  query Transactions($limit: Int!, $offset: Int!) {
    transaction(limit: $limit, offset: $offset, order_by: { height: desc }) {
      fee
      gasUsed: gas_used
      gasWanted: gas_wanted
      hash
      height
      logs
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
`
