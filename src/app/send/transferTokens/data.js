// All properties on a domain are optional
export const domain = {
    name: 'Permit2',
    verifyingContract: '0x000000000022D473030F116dDEE9F6B43aC78BA3', // permit2
  }
   
  // The named list of all type definitions
  export const types = {
    PermitBatchTransferFrom: [
        { name: 'permitted', type: 'TokenPermissions[]' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
    ],
    TokenPermissions: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' }
    ]
  }