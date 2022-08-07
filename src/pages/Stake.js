import React from "react";
import OptimismStakeBody from "../components/OptimsimStakeBody";
import PolyStakeBody from "../components/PolyStakeBody";
import OptimismPoolData from "../components/OptimismPoolData";
import PolyPoolData from "../components/PolyPoolData";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export default function PolyStake() {
   const { search } = useLocation();
   const { chain } = queryString.parse(search);

   function stakeChain() {
      if (chain === "polygon") {
         return (
            <>
               <PolyStakeBody />
               <PolyPoolData />
            </>
         );
      } else if (chain === "optimism") {
         return (
            <>
               <OptimismStakeBody />
               <OptimismPoolData />
            </>
         );
      }
   }
   return <>{stakeChain()}</>;
}
