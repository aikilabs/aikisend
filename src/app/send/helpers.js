export const MAX_UINT256 = BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export const MAX_UINT128 = BigInt("0xffffffffffffffffffffffffffffffff");

// compute a random nonce as BigInt
export function getRandomNonce() {
    let nonce = BigInt(Math.floor(10 * Math.random())) * MAX_UINT128;
    while (nonce == 0n) {
        nonce = BigInt(Math.floor(10 * Math.random())) * MAX_UINT128;
    }
    return nonce;
}
