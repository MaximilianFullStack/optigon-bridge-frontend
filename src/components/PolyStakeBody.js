import React, { useState } from "react";
import { ethers } from "ethers";
import poly from "../images/polygon.png";
import opti from "../images/optimism.png";
import user from "../images/user.png";
import "../stake.css";

import { abi, contractAddresses } from "../constants";

export default function PolyStakeBody() {
   // input
   const [etherInput, setEtherInput] = useState("");
   function getInputValue(value) {
      setEtherInput(value.target.value);
   }

   async function stakeEther() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x13881" && etherInput > 0) {
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
         if (position.toString() === "0") {
            const weth = new ethers.Contract(
               contractAddresses.mumbaiWeth,
               abi.mumbaiWeth,
               signer
            );

            const wethBal = await weth.balanceOf(signerAddr);
            const allowance = await weth.allowance(
               signerAddr,
               contractAddresses.polygon
            );

            if (wethBal >= ethers.utils.parseEther(etherInput)) {
               if (
                  allowance.toString() >=
                  ethers.utils.parseEther(etherInput).toString()
               ) {
                  try {
                     const tx = await bridge.stake(
                        ethers.utils.parseEther(etherInput)
                     );
                     await tx.wait(10000).then(window.location.reload(false));
                  } catch (e) {
                     console.log(e);
                  }
               } else {
                  const tx = await weth.approve(
                     contractAddresses.polygon,
                     ethers.utils.parseEther(etherInput)
                  );
                  await tx.wait(10000).then(window.location.reload(false));
               }
            } else {
               console.warn("Weth balance too low");
            }
         } else {
            console.warn("Already have staked Postion.");
         }
      } else {
         console.warn("Wrong Network or Zero Value Input");
      }
   }

   return (
      <>
         <div className="stakeBody">
            <button className="dropdown">
               <img src={poly} alt="polygonLogo" className="logo" />
               <span>Polygon</span>
               <div className="dropdown-content">
                  <ul className="chainChoices">
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
                  </ul>
               </div>
            </button>
            <a href="/user?chain=polygon" className="userLink">
               <img src={user} alt="user" className="userImg" />
            </a>
            <h1>Stake WETH</h1>
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
