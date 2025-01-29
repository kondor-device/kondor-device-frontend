import React from "react";
import HeaderDesk from "./HeaderDesk";
import HeaderMob from "./socialLinks/headerMob/HeaderMob";

export default function Header() {
  return (
    <header>
      <HeaderDesk />
      <HeaderMob />
    </header>
  );
}
