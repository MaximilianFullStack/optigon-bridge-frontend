import React, { useState } from "react";
import "../connectButton.css";

export default function ConnectButton() {
   const [displayText, setDisplayText] = useState("Connect");

   async function connectWalletHandeler() {
      if (window.ethereum !== "undefined") {
         window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((result) => {
               accountChangedHandler(result[0]);
            });
      } else {
         console.log("Install metamask");
      }
   }

   const accountChangedHandler = (newAccount) => {
      displayOnConnect(newAccount);
   };

   async function displayOnConnect(user) {
      if (window.ethereum !== "undefined" && user !== "undefined") {
         setDisplayText(
            user.slice(0, 5) + "..." + user.slice(user.length - 4, user.length)
         );
      }
   }

   window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts[0] !== "undefined") {
         displayOnConnect(accounts[0]);
      }
   });

   window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
   });

   return (
      <>
         <button onClick={connectWalletHandeler} className="connectButton">
            {displayText}
         </button>
      </>
   );
}
