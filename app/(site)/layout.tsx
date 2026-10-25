import type { Metadata } from "next";
import { Cursor } from "@/components/motion/Cursor";
import { Preloader, preloaderScript } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { fontVariables } from "@/components/site/fonts";
import { getPortfolio } from "@/sanity/lib/queries";
import "./globals.css";
import s from "./layout.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPortfolio();
  const title = settings.title ?? "Khushboo Punjani — Copywriter";
  return {
    title: { default: title, template: "%s — Khushboo Punjani" },
    description: settings.description,
    openGraph: {
      title,
      description: settings.description,
      images: settings.ogImage ? [{ url: `${settings.ogImage}?w=1200&h=630&fit=crop`, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { settings } = await getPortfolio();
  return (
    <div id="top" className={`${fontVariables} ${s.site}`}>
      {/* Must run before anything paints; decides whether the intro plays. */}
      <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className={s.main}>{children}</main>
      <Footer settings={settings} />
      <div className={s.grain} aria-hidden />
    </div>
  );
}
