import React from "react";
import OptimismBridgeBody from "../components/OptimismBridgeBody";
import PolygonBridgeBody from "../components/PolyBridgeBody";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export default function Bridge() {
   const { search } = useLocation();
   const { chain } = queryString.parse(search);

   //  function bridgeChain() {
   //    if (chain === "polygon") {}
   //  }

   return (
      <>
         {chain === "optimism" ? <OptimismBridgeBody /> : <PolygonBridgeBody />}
      </>
   );
}
