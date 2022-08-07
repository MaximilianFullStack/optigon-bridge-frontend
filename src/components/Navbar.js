import React from "react";
import ConnectButton from "./ConnectButton";
import "../style.css";
import optigonLogo from "../images/Optigon.png";

export default function Navbar() {
   return (
      <nav className="navbar">
         <a href="/bridge?chain=polygon">
            <img src={optigonLogo} alt="OPTIGON" />
         </a>
         <ul>
            <li>
               <a href="/bridge?chain=polygon">Bridge</a>
            </li>
            <li>
               <a href="/stake?chain=polygon">Stake</a>
            </li>
         </ul>
         <ConnectButton />
      </nav>
   );
}
