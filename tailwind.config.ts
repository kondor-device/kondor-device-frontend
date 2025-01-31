import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
      },
      screens: {
        mob: "390px",
        tab: "768px",
        tabxl: "1024px",
        laptop: "1280px",
        desk: "1550px",
        deskxl: "1920px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          md: "32px",
          xl: "80px",
          desk: "100px",
          deskxl: "240px",
        },
      },
      fontSize: {
        "10med": ["10px", { fontWeight: "500", lineHeight: "12px" }],
        "12reg": ["12px", { fontWeight: "400", lineHeight: "15px" }],
        "12med": ["12px", { fontWeight: "500", lineHeight: "15px" }],
        "12semi": ["12px", { fontWeight: "600", lineHeight: "15px" }],
        "12bold": ["12px", { fontWeight: "700", lineHeight: "15px" }],
        "14med": ["14px", { fontWeight: "500", lineHeight: "17px" }],
        "14semi": ["14px", { fontWeight: "600", lineHeight: "17px" }],
        "14bold": ["14px", { fontWeight: "700", lineHeight: "17px" }],
        "16med": ["16px", { fontWeight: "500", lineHeight: "20px" }],
        "16semi": ["16px", { fontWeight: "600", lineHeight: "20px" }],
        "18reg": ["18px", { fontWeight: "400", lineHeight: "22px" }],
        "18med": ["18px", { fontWeight: "500", lineHeight: "22px" }],
        "18semi": ["18px", { fontWeight: "600", lineHeight: "22px" }],
        "18bold": ["18px", { fontWeight: "700", lineHeight: "22px" }],
        "20med": ["20px", { fontWeight: "500", lineHeight: "24px" }],
        "20semi": ["20px", { fontWeight: "600", lineHeight: "24px" }],
        "20bold": ["20px", { fontWeight: "700", lineHeight: "24px" }],
        "22med": ["22px", { fontWeight: "500", lineHeight: "27px" }],
        "22bold": ["22px", { fontWeight: "700", lineHeight: "27px" }],
        "24reg": ["24px", { fontWeight: "400", lineHeight: "29px" }],
        "24med": ["24px", { fontWeight: "500", lineHeight: "29px" }],
        "24semi": ["24px", { fontWeight: "600", lineHeight: "29px" }],
        "24bold": ["24px", { fontWeight: "700", lineHeight: "29px" }],
        "28bold": ["28px", { fontWeight: "700", lineHeight: "28px" }],
        "32bold": ["32px", { fontWeight: "700", lineHeight: "39px" }],
        "36med": ["36px", { fontWeight: "500", lineHeight: "45px" }],
        "40bold": ["40px", { fontWeight: "700", lineHeight: "49px" }],
        "45bold": ["45px", { fontWeight: "700", lineHeight: "63px" }],
        "54bold": ["54px", { fontWeight: "700", lineHeight: "66px" }],
      },
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        yellow: "#FFB300",
        grey: "#A2A2A2",
        lightGrey: "#D9D9D9",
      },
      backgroundImage: {
        yellowGradient:
          "linear-gradient(115.41deg, #FFCC54 10.87%, #FFB300 81.45%)",
      },
      boxShadow: {
        card: "0px 0.74px 11.12px 0px rgba(103, 103, 103, 0.25)",
        colorPickerThin: "0 0 0 1px #FFFFFF",
        colorPicker: "0 0 0 2px #FFFFFF",
      },
    },
  },
  plugins: [],
} satisfies Config;
