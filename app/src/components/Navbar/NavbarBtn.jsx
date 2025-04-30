import React from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const NavbarBtn = () => {
  return (
    <button className="flex hover:scale-110 hover:border-orange-400 text-cyan-50 transition-all duration-500 px-4 border gap-1 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-full py-2 font-bold text-xl items-center border-cyan-400">
      Hire Me
      <MdKeyboardDoubleArrowRight />
      </button>
  );
};

export default NavbarBtn;
