import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portal - Core Francisco Park",
  description: "Research portal and experiments",
  icons: {
    icon: [
      { url: "/icons/v2/favicon.ico", type: "image/x-icon" },
      { url: "/icons/v2/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/v2/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/v2/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/v2/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/icons/v2/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}