"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";

import { domain, types } from "./data";
import { createWalletClient, custom } from 'viem'
import { goerli } from 'viem/chains'

const Page = () => {
    const [transferDetails, setTransferDetails] = useState([])
    const [permitData, setPermitData] = useState({})
    const selectedTokens = useSelector((state) => state.aikiSend.selectedToken)
    const account = useSelector((state) => state.aikiSend.address)
    const nonce = useSelector((state) => state.aikiSend.nonce)
    
    const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
    const walletClient = createWalletClient({
        account,
        chain: goerli,
        transport: custom(window.ethereum)
    })

    async function signTransferData() {
        if(!account) return
        console.log('account', account)

        const permit = Object.create(null);
        const tokenPermissionsData = []
        const details = []
        
        selectedTokens.forEach((token) => {
            console.log('recipients', token.recipient)

            token.recipient.forEach(({address, amount}) => {
                tokenPermissionsData.push({
                    token: token.token_address,
                    amount: BigInt(amount)
                });

                details.push({
                    to: address,
                    requestedAmount: amount
                });
            })
        });

        permit.permitted = tokenPermissionsData;
        permit.nonce = getRandomNonce();    // random nonce.
        permit.deadline = MAX_UINT256;      // max expiry

        setPermitData(permit);
        setTransferDetails(details);

        const chainId = await walletClient.getChainId()
        console.log('chainid', chainId)


        const signature = await walletClient.signTypedData({
            account,
            domain: {...domain, chainId},
            types,
            primaryType: 'PermitBatchTransferFrom',
            message: {
                permitted: permit.permitted,
                nonce: permit.nonce,
                deadline: permit.deadline
            },
        })
        return signature;
    }

    async function handleClick() {
        const signature = await signTransferData();
        console.log('signature', signature)
        console.log('permit data', permitData)
        console.log('transfer details', transferDetails)
    }

    // compute a random nonce as BigInt
    function getRandomNonce() {
        const MAX_UINT128 = BigInt("0xffffffffffffffffffffffffffffffff")
        let nonce = BigInt(Math.floor(10 *Math.random())) * MAX_UINT128;
        while (nonce == 0n) {
            nonce = BigInt(Math.floor(10 *Math.random())) * MAX_UINT128;
        }
        return nonce;
    }

    return (
        <section className="flex flex-col flex-1 h-full ">
            <div className="flex-1 h-full ">
                <button 
                    className="relative text-3xl transition-all duration-200 flex items-end flex-col w-min text-gray-400"
                    onClick={handleClick}>
                    Sign712 Permit
                </button>
            </div>
            <BottomSig />
        </section>
    );
};

export default Page;
