import { Bodoni_Moda, Geist_Mono, Inter_Tight } from "next/font/google";

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

/** Put on <body> so every font variable is available. */
export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
