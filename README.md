## AikiSend
AikiSend is a Next Gen multi-token sender applicaton, built on the industry standard Permit2 contract from Uniswap, and also has supports ENS domains.  

## Features
1. Batched multi-tokens transfers. Unlike other multisender application that only allows transfer of one token to multiple addresses, with AikiSend you can transer multiple tokens say (Dai, Uni, USDC) to multiple addresses all in one transaction.  

2. ENS domains support. Aikisend has integrated ENS to allow for token transfers to valid ENS names, hence improving the User Experience.   

3. Multi-Chain. AikiSend works out of the box on many EVM chains with Permit2 deployment.   


## How It Works
- On landing on the homepage, a user connect their wallet account.
- The list of tokens in the connected wallet can be inputed using the search box.
- Enter the recipient address or valid ENS domain to author token transfer for that address.
- Approve Permit2 contract to spend tokens. Note: If Permit2 has been approved previously, this step is skipped.
- Sign the Signature data for the transer.
- Proceed to make the transfer, all in one transaction🎉.

AikiSend is free and open to public use, however we appreciate donations from the broader community to continually improve the application and keep it live.    
## ETH WALLET ADDRESS
**0x2e2316088c015F4BF27D86A1458A707af536A324**


## Contributing

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Branch off `main` and submit Pull Requests.