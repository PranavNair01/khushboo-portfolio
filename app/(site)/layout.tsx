import type { Metadata } from "next";
import { InlineScript } from "@/components/InlineScript";
import { Cursor } from "@/components/motion/Cursor";
import { Preloader, preloaderScript } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { fontVariables } from "@/components/site/fonts";
import { siteUrl } from "@/lib/site";
import { getPortfolio } from "@/sanity/lib/queries";
import "./globals.css";
import s from "./layout.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPortfolio();
  const title = settings.title ?? "Khushboo Punjani — Copywriter";
  const images = settings.ogImage
    ? [{ url: `${settings.ogImage}?w=1200&h=630&fit=crop`, width: 1200, height: 630 }]
    : [];
  return {
    metadataBase: siteUrl,
    title: { default: title, template: "%s — Khushboo Punjani" },
    description: settings.description,
    openGraph: { type: "website", siteName: "Khushboo Punjani", title, description: settings.description, images },
    twitter: { card: "summary_large_image", title, description: settings.description, images },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { settings } = await getPortfolio();
  return (
    <div id="top" className={`${fontVariables} ${s.site}`}>
      {/* Must run before anything paints; decides whether the intro plays. */}
      <InlineScript html={preloaderScript} />
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="content" className={s.main}>
        {children}
      </main>
      <Footer settings={settings} />
      <div className={s.grain} aria-hidden />
    </div>
  );
}
