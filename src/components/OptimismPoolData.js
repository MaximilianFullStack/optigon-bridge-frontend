import React, { useState } from "react";
import { ethers } from "ethers";
import "../stake.css";

import { abi, contractAddresses } from "../constants";

export default function OptimismPoolData() {
   const [oraclePrice, setOraclePrice] = useState("");
   const [lockedTokens, setLockedTokens] = useState("");
   const [fee, setFeeValue] = useState("");
   const [share, setPoolShare] = useState("");

   const RPC =
      "https://opt-goerli.g.alchemy.com/v2/fPIO4h4AEw7YD3MuImmy6ZkhJcpIuLXS";
   const oracleRPC =
      "https://eth-mainnet.g.alchemy.com/v2/IiraeWECQivpRSgcl1U99yEtsbdSiBp8";

   async function getOracleEthPrice() {
      const alchemy = new ethers.providers.JsonRpcProvider(oracleRPC);
      const contract = new ethers.Contract(
         contractAddresses.oracle,
         abi.oracle,
         alchemy
      );
      const price = (await contract.latestRoundData())[1];
      setOraclePrice(price / 100000000);
   }

   async function getContractData() {
      const alchemy = new ethers.providers.JsonRpcProvider(RPC);
      const contract = new ethers.Contract(
         contractAddresses.optimism,
         abi.optimism,
         alchemy
      );
      try {
         const loTokens = await contract.TLV();
         const gfee = await contract.adminFee();
         setLockedTokens(ethers.utils.formatEther(loTokens));
         setFeeValue((100 / gfee).toString());
         getOracleEthPrice();

         if (window.ethereum) {
            const provider = await new ethers.providers.Web3Provider(
               window.ethereum
            );
            const signer = await provider.getSigner();
            const signerAddr = await signer.getAddress();
            let stakedPosition = await contract.stakedPosition(signerAddr);
            stakedPosition = ethers.utils.formatEther(stakedPosition);
            setPoolShare(
               (stakedPosition / ethers.utils.formatEther(loTokens)) * 100
            );
         } else {
            setPoolShare("0");
         }
      } catch (e) {
         console.log(e);
      }
   }

   window.onload = getContractData;

   return (
      <div className="poolData">
         <ul>
            <li>
               <p>Share of Pool:</p>
               <h4>{parseFloat(share).toFixed(2)}%</h4>
            </li>
            <h3>Pool Data</h3>
            <li>
               <p>APR:</p>
               <h4>{(0.0).toFixed(2)}%</h4>
            </li>
            <li>
               <p>Tokens Locked:</p>
               <h4>{parseFloat(lockedTokens).toFixed(2)} ETH</h4>
            </li>
            <li>
               <p>TLV:</p>
               <h4>${(lockedTokens * oraclePrice).toFixed(2)}</h4>
            </li>
            <li>
               <p>Fee:</p>
               <h4>{fee.slice(0, 4)}%</h4>
            </li>
         </ul>
      </div>
   );
}
