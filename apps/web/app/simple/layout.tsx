import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Core Francisco Park",
  description: "Ph.D. Candidate at Harvard Physics",
  icons: {
    icon: "/sparrow.png",
    shortcut: "/sparrow.png",
    apple: "/sparrow.png",
  },
}

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          * {
            font-family: "Times New Roman", Times, serif !important;
          }
          body {
            margin: 8px;
            background: white;
            color: black;
            font-family: "Times New Roman", Times, serif !important;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: "Times New Roman", Times, serif !important;
            font-weight: bold;
          }
          a {
            color: blue;
            text-decoration: underline;
          }
          a:visited {
            color: purple;
          }
          p, li, ul, ol {
            font-family: "Times New Roman", Times, serif !important;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}