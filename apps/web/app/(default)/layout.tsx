import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@workspace/ui/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@workspace/ui/components/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Core Francisco Park",
  description: "Ph.D. Candidate at Harvard Physics - AI/ML Research, Astrophysics, and Neuroscience",
  icons: {
    icon: "/sparrow.png",
    shortcut: "/sparrow.png",
    apple: "/sparrow.png",
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
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1 bg-transparent">{children}</main>
            <footer className="border-t bg-background/50">
              <div className="container py-3 md:py-4">
                <div className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Core Francisco Park. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}