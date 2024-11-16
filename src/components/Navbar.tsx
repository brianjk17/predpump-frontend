import React from "react";
import useToken from "../hooks/useToken";
import Link from "next/link";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";

export default function Navbar() {
  const { userBalance } = useToken();

  return (
    <div className="flex flex-row justify-between items-center px-5 bg-darkgreen p-2 z-20">
      <div className="text-white press-start-2p-regular">PREDPUMP</div>
      <div className=" flex flex-row justify-center items-center gap-5 text-teal-300">
        <Link href="/profile">[View Profile]</Link>
        <Link href="/create">[Create Bets]</Link>
        <div>[{(Number(userBalance) / 10 ** 18).toLocaleString()} USDC]</div>
        <Wallet>
          <ConnectWallet withWalletAggregator>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownBasename />
            <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
              Wallet
            </WalletDropdownLink>
            <WalletDropdownLink href="https://keys.coinbase.com">
              Settings
            </WalletDropdownLink>
            <WalletDropdownFundLink />
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
}
