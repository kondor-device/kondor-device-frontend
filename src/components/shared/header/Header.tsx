import React from "react";
import HeaderDesk from "./HeaderDesk";
import HeaderMob from "./navMenu/headerMob/HeaderMob";

export default function Header() {
  return (
    <header>
      <HeaderDesk />
      <HeaderMob />
    </header>
  );
}
