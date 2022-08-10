import React, { useState } from "react";
import { ethers } from "ethers";
import optimism from "../images/optimism.png";
import eth from "../images/eth.png";
import arrow from "../images/arrows.png";
import droparrow from "../images/dropdown.png";
import poly from "../images/polygon.png";
import weth from "../images/weth.png";
import "../style.css";

import { abi, contractAddresses } from "../constants";

export default function OptimismBridge() {
   const [etherInput, setEtherInput] = useState("");
   const [wethInput, setWethInput] = useState("");

   function handleWethInput(value) {
      setWethInput(value.target.value);
      const fee = value.target.value / 334;
      const output = parseFloat(value.target.value) + parseFloat(fee);
      setEtherInput(output);
   }

   function handleEtherInput(value) {
      setEtherInput(value.target.value);
      const fee = value.target.value / 334;
      const output = parseFloat(value.target.value) - parseFloat(fee);
      setWethInput(output);
   }

   async function checkLiquidity() {
      const RPC =
         "";

      const alchemy = new ethers.providers.JsonRpcProvider(RPC);
      const bridge = new ethers.Contract(
         contractAddresses.polygon,
         abi.polygon,
         alchemy
      );
      const weth = new ethers.Contract(
         contractAddresses.mumbaiWeth,
         abi.mumbaiWeth,
         alchemy
      );
      const bal = await weth.balanceOf(contractAddresses.polygon);
      const genFees = await bridge.totalGeneratedFees();
      const tlv = bal - genFees;
      return tlv.toString();
   }

   async function bridgeEth() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x1a4" && etherInput > 0) {
         const polyLiquidity = await checkLiquidity();
         if (ethers.utils.formatEther(polyLiquidity) > etherInput) {
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

            let userBal = await provider.getBalance(signerAddr);
            userBal = ethers.utils.formatEther(userBal.toString());
            if (userBal >= etherInput) {
               try {
                  const tx = await bridge.bridgeEther({
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
            console.warn("Polygon Liquidity too low");
         }
      } else {
         console.warn("Wrong network or zero value input");
      }
   }

   return (
      <div className="bridgeBody">
         <div className="inputLine">
            <img src={optimism} alt="optimismLogo" className="chainLogo" />
            <h3>Optimism</h3>
            <input
               type="number"
               min="0"
               placeholder="0.0"
               value={etherInput}
               onChange={handleEtherInput}
            ></input>
            <img src={eth} alt="ETH" className="asset" />
         </div>
         <div className="arrowRow">
            <img src={droparrow} alt="arrow" className="chainArrow" />
            <a href="/bridge?chain=polygon" className="arrows">
               <img src={arrow} alt="arrow" className="arrows" />
            </a>
         </div>
         <div className="inputLine">
            <img src={poly} alt="polygonLogo" className="chainLogo" />
            <h3>Polygon</h3>
            <input
               type="number"
               min="0"
               placeholder="0.0"
               value={wethInput}
               onChange={handleWethInput}
            ></input>
            <img src={weth} alt="ETH" className="asset" />
         </div>
         <button className="bridgeButton" onClick={bridgeEth}>
            Bridge
         </button>
      </div>
   );
}
