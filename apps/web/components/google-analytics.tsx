"use client"

import Script from "next/script"
import { useEffect } from "react"

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_TRACKING_ID) {
      console.log("Google Analytics: No tracking ID configured")
    }
  }, [])

  // Don't render anything if no GA ID is provided
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Google Analytics failed to load:", e)
        }}
      />
      <Script 
        id="google-analytics" 
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Google Analytics script error:", e)
        }}
      >
        {`
          try {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          } catch (error) {
            console.error('Google Analytics initialization error:', error);
          }
        `}
      </Script>
    </>
  )
}