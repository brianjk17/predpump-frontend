"use client";

import Link from "next/link";

const Footer = ({ className }: { className?: string }) => (
  <footer className="flex w-full justify-center gap-8 border-t p-4 z-20 text-white">
    <div className="text-base font-bold uppercase opacity-60 transition-all press-start-2p-regular">
      &copy; {new Date().getFullYear()} PREDPUMP
    </div>
    <Link
      className="duration-[0.3s] text-base press-start-2p-regular uppercase transition-all hover:opacity-60"
      href="https://www.monprotocol.ai/legal/terms-of-service"
      target="_blank"
    >
      Terms of Service
    </Link>
  </footer>
);

export default Footer;
