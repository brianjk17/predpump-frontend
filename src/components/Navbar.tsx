import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import useToken from "../hooks/useToken";
import Link from "next/link";

export default function Navbar() {
  const { userBalance } = useToken();

  return (
    <div className="flex flex-row justify-between items-center px-5 bg-darkgreen p-2 z-20">
      <div>PREDPUMP</div>
      <div className=" flex flex-row justify-center items-center gap-5 text-teal-300">
        <Link href="/profile">[View Profile]</Link>
        <Link href="/create">[Create Bets]</Link>
        <div>[{Number(userBalance)} USDC]</div>
        <ConnectButton showBalance={false} />
      </div>
    </div>
  );
}
