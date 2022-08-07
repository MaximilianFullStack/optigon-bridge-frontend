import React, { useState } from "react";
import { ethers } from "ethers";
import poly from "../images/polygon.png";
import opti from "../images/optimism.png";
import user from "../images/user.png";
import "../stake.css";

import { abi, contractAddresses } from "../constants";

export default function OptimismStakeBody() {
   // input
   const [etherInput, setEtherInput] = useState("");
   function getInputValue(value) {
      setEtherInput(value.target.value);
   }

   async function stakeEther() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x1a4" && etherInput > 0) {
         const provider = await new ethers.providers.Web3Provider(
            window.ethereum
         );
         const signer = await provider.getSigner();
         const signerAddr = await signer.getAddress();

         const bridge = new ethers.Contract(
            contractAddresses.optimism,
            abi.optimism,
            signer
         );

         const position = await bridge.poolShare(signerAddr);
         if (position.toString() === "0") {
            let userBal = await provider.getBalance(signerAddr);
            userBal = ethers.utils.formatEther(userBal.toString());
            if (userBal >= etherInput) {
               try {
                  const tx = await bridge.stake({
                     value: ethers.utils.parseEther(etherInput),
                  });
                  await tx.wait(10000).then(window.location.reload(false));
               } catch (e) {
                  console.log(e);
               }
            } else {
               console.warn("Not enough eth");
            }
         } else {
            console.warn("Already have staked Postion.");
         }
      } else {
         console.warn("Wrong network or zero value input");
      }
   }

   return (
      <>
         <div className="stakeBody">
            <button className="dropdown">
               <img src={opti} alt="optimismLogo" className="logo" />
               <span>Optimism</span>
               <div className="dropdown-content">
                  <ul className="chainChoices">
                     <li>
                        <a href="stake?chain=optimism">
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
                     <li>
                        <a href="stake?chain=polygon">
                           <button>
                              <img
                                 src={poly}
                                 alt="polygonLogo"
                                 className="logo"
                              />
                              Polygon
                           </button>
                        </a>
                     </li>
                  </ul>
               </div>
            </button>
            <a href="/user?chain=optimism" className="userLink">
               <img src={user} alt="user" className="userImg" />
            </a>
            <h1>Stake ETH</h1>
            <input
               className="input"
               type="number"
               min="0"
               placeholder="0.0"
               onChange={getInputValue}
            ></input>
            <button className="bridgeButton" onClick={stakeEther}>
               Stake
            </button>
         </div>
      </>
   );
}
