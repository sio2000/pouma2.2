import "./globals.css";
import { rootMetadata } from "@/lib/seo";
import { PRELOADER_STORAGE_KEY } from "@/lib/preloader";
import Preloader from "@/components/layout/Preloader";

export const metadata = rootMetadata;

const preloaderInitScript = `(function(){try{var k="${PRELOADER_STORAGE_KEY}";if(localStorage.getItem(k)==="1"){document.documentElement.classList.add("preloader-ready");}else{document.documentElement.classList.add("preloader-pending");}}catch(e){document.documentElement.classList.add("preloader-pending");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* EB Garamond replaces Cormorant Garamond as the display serif: it is
            the same Garamond revival, but Google only ships Cormorant with
            latin and cyrillic, so every Greek heading was quietly falling back
            to Georgia while the English ones kept the elegant serif. EB
            Garamond carries greek and greek-ext, so both scripts now render in
            the same typeface. */}
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <div
          id="preloader-static"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-plum-mid"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/finallogo.png"
            alt=""
            width={112}
            height={112}
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_30px_rgba(176,154,232,0.55)]"
          />
        </div>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
