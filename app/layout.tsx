// Bare document shell shared by the public site and the embedded Studio.
// Site-specific fonts and styles live in app/(site)/layout.tsx so they
// never leak into the Studio.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
