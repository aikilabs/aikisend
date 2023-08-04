export const MAX_UINT256 = BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export const MAX_UINT128 = BigInt("0xffffffffffffffffffffffffffffffff");

// compute a random nonce as BigInt
export function getRandomNonce() {
    return BigInt(new Date().getTime());
}
