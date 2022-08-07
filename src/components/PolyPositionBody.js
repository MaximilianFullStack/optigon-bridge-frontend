import React, { useState } from "react";
import { ethers } from "ethers";
import poly from "../images/polygon.png";
import opti from "../images/optimism.png";
import "../stake.css";

import { abi, contractAddresses } from "../constants";

export default function PolyPositionBody() {
   const [stakedAmount, setStakedAmount] = useState("");
   const [totalGenFees, setTotalGenFees] = useState("");
   const [poolShare, setPoolShare] = useState("");

   const RPC =
      "https://polygon-mumbai.g.alchemy.com/v2/uw_Gwkz6SjluycgL-W_SZseL28Enw11G";

   async function getUserData() {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddr = await signer.getAddress();

      const alchemy = new ethers.providers.JsonRpcProvider(RPC);
      const bridge = new ethers.Contract(
         contractAddresses.polygon,
         abi.polygon,
         alchemy
      );

      try {
         let stakedPosition = await bridge.userStakedAmount(signerAddr);
         const loTokens = await bridge.TLV();
         const totalGeneratedFees = await bridge.totalGeneratedFees();
         stakedPosition = ethers.utils.formatEther(stakedPosition);
         setStakedAmount(stakedPosition.toString());
         setTotalGenFees(
            ethers.utils.formatEther(totalGeneratedFees).toString()
         );
         setPoolShare(
            (stakedPosition / ethers.utils.formatEther(loTokens)) * 100
         );
      } catch (e) {
         console.log(e);
      }
   }

   window.onload = getUserData();

   async function unstakeEther() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x13881") {
         const provider = await new ethers.providers.Web3Provider(
            window.ethereum
         );
         const signer = await provider.getSigner();
         const signerAddr = await signer.getAddress();

         const bridge = new ethers.Contract(
            contractAddresses.polygon,
            abi.polygon,
            signer
         );

         const position = await bridge.poolShare(signerAddr);
         if (position.toString() !== "0") {
            try {
               const tx = await bridge.unStake();
               await tx.wait(10000).then(window.location.reload(false));
            } catch (e) {
               console.log(e);
            }
         } else {
            console.warn("User doesnt have a staked Postion.");
         }
      } else {
         console.warn("Wrong network");
      }
   }

   async function claimFees() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x13881") {
         const provider = await new ethers.providers.Web3Provider(
            window.ethereum
         );
         const signer = await provider.getSigner();

         const bridge = new ethers.Contract(
            contractAddresses.polygon,
            abi.polygon,
            signer
         );

         if (totalGenFees > 0) {
            try {
               const tx = await bridge.distributeFees();
               await tx.wait(10000).then(window.location.reload(false));
            } catch (e) {
               console.log(e);
            }
         } else {
            console.log("Zero generated fees");
         }
      } else {
         console.warn("Wrong network");
      }
   }

   return (
      <div className="stakeBody">
         <button className="dropdown">
            <img src={poly} alt="polygonLogo" className="logo" />
            <span>Polygon</span>
            <div className="dropdown-content">
               <ul className="chainChoices">
                  <li>
                     <a href="user?chain=polygon">
                        <button>
                           <img src={poly} alt="polygonLogo" className="logo" />
                           Polygon
                        </button>
                     </a>
                  </li>
                  <li>
                     <a href="user?chain=optimism">
                        <button>
                           <img
                              src={opti}
                              alt="optimismLogo"
                              className="logo"
                           />
                           Optimism
                        </button>
                     </a>
                  </li>
               </ul>
            </div>
         </button>
         <h1 className="stakedAmount">{stakedAmount}</h1>
         <h2 className="amtTitle">WETH Staked</h2>
         <div className="feesGenerated">
            <h3>{((totalGenFees / 2) * poolShare).toFixed(2)}</h3>
            <h3>WETH in unclaimed fees available.</h3>
         </div>
         <div className="positionControls">
            <button className="userButtons" onClick={unstakeEther}>
               Unstake
            </button>
            <button className="userButtons" onClick={claimFees}>
               Claim Fees
            </button>
         </div>
      </div>
   );
}
