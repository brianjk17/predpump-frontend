import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import useToken from "../hooks/useToken";

export default function Navbar() {
  const { userBalance } = useToken();

  return (
    <div className="flex flex-row justify-between items-center px-5">
      <div>PREDPUMP</div>
      <div className=" flex flex-row justify-center items-center gap-5">
        <div>{Number(userBalance)} USDC</div>
        <ConnectButton />
      </div>
    </div>
  );
}
