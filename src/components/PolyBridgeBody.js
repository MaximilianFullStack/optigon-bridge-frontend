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

export default function PolygonBridgeBody() {
   const [etherInput, setEtherInput] = useState("");
   const [wethInput, setWethInput] = useState("");

   function handleWethInput(value) {
      setWethInput(value.target.value);
      const fee = value.target.value / 334;
      const output = parseFloat(value.target.value) - parseFloat(fee);
      setEtherInput(output);
   }

   function handleEtherInput(value) {
      setEtherInput(value.target.value);
      const fee = value.target.value / 334;
      const output = parseFloat(value.target.value) + parseFloat(fee);
      setWethInput(output);
   }

   async function checkLiquidity() {
      const RPC =
         "";

      const alchemy = new ethers.providers.JsonRpcProvider(RPC);
      const bridge = new ethers.Contract(
         contractAddresses.optimism,
         abi.optimism,
         alchemy
      );
      const bal = await alchemy.getBalance(contractAddresses.optimism);
      const genFees = await bridge.totalGeneratedFees();
      const tlv = bal - genFees;
      return tlv.toString();
   }

   async function bridgeWeth() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x13881" && wethInput > 0) {
         const optiLiquidty = await checkLiquidity();
         if (ethers.utils.formatEther(optiLiquidty) >= wethInput) {
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

            if (wethBal >= ethers.utils.parseEther(wethInput)) {
               if (
                  allowance.toString() >=
                  ethers.utils.parseEther(wethInput).toString()
               ) {
                  try {
                     const tx = await bridge.bridgeWeth(
                        ethers.utils.parseEther(wethInput)
                     );
                     await tx.wait(10000).then(window.location.reload(false));
                  } catch (e) {
                     console.log(e);
                  }
               } else {
                  await weth.approve(
                     contractAddresses.polygon,
                     ethers.utils.parseEther(wethInput)
                  );
               }
            } else {
               console.warn("Not enough Weth");
            }
         } else {
            console.warn("Optimism Liquidity too low");
         }
      } else {
         console.warn("Wrong network or zero value input");
      }
   }

   return (
      <div className="bridgeBody">
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
         <div className="arrowRow">
            <img src={droparrow} alt="arrow" className="chainArrow" />
            <a href="/bridge?chain=optimism" className="arrows">
               <img src={arrow} alt="arrow" className="arrows" />
            </a>
         </div>
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

         <button className="bridgeButton" onClick={bridgeWeth}>
            Bridge
         </button>
      </div>
   );
}
