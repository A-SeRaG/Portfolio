import React from "react";
import NavbarLogo from "./NavbarLogo";
import NavbarLinks from "./NavbarLinks";
import NavbarBtn from "./NavbarBtn";
import { GiHamburgerMenu } from "react-icons/gi";

const NavbarMain = () => {
  return (
    <nav className="max-w-[1300px] mx-auto flex px-4 z-20">
      <div className="flex justify-between rounded-r-full rounded-l-full border-2 border-amber-400 items-center w-full mx-auto max-w-[1200px] p-6 bg-navy">
        <NavbarLogo />
        <NavbarLinks />
        <NavbarBtn />
      </div>
      <div>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default NavbarMain;
