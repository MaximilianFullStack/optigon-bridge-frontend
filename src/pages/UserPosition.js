import React from "react";
import PolyPositionBody from "../components/PolyPositionBody";
import OptimismPositionBody from "../components/OptimismPositionBody";
import PolyPoolData from "../components/PolyPoolData";
import OptimismPoolData from "../components/OptimismPoolData";

import { useLocation } from "react-router-dom";
import queryString from "query-string";

export default function UserPosition() {
   const { search } = useLocation();
   const { chain } = queryString.parse(search);

   function userChain() {
      if (chain === "polygon") {
         return (
            <>
               <PolyPositionBody />
               <PolyPoolData />
            </>
         );
      } else if (chain === "optimism") {
         return (
            <>
               <OptimismPositionBody />
               <OptimismPoolData />
            </>
         );
      }
   }
   return <>{userChain()}</>;
}
