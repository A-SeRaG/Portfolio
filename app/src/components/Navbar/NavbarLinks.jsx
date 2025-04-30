import React from "react";

const links = [
  { link: "About", section: "#about" },
  { link: "Experience", section: "experience" },
  { link: "Skills", section: "#skills" },
  { link: "Projects", section: "#projects" },
  { link: "Contact", section: "#contact" },
];

const NavbarLinks = () => {
  return (
    <ul className="flex gap-6 text-amber-500 font-bold text-center py-4">
      {links.map((link, index) => {
        return (
          <li className="group">
            <a href="#" className="curser-pointer text-white transition-all duration-500 hover:text-cyan-300">{link.link}</a>
          <div className="w-0 mx-auto bg-cyan-300 transition-all duration-500 h-[1px] group-hover:w-full"></div>  
          </li>
        );
      })}
    </ul>
  );
};

export default NavbarLinks;
