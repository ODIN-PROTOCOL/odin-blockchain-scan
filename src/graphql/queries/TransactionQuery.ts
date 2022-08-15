import gql from 'graphql-tag'

export const TransactionQuery = gql`
  query Transaction($hash: String!) {
    transaction(where: { hash: { _eq: $hash } }) {
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
