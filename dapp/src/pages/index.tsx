import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";


const Home: NextPage = () => {
  return (
    <div>
      <ConnectButton></ConnectButton>
      <h1 className=" text-9xl text-blue-900">Hello world</h1>
    </div>
  );
};

export default Home;
