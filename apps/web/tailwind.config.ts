import type { Config } from "tailwindcss"
import sharedConfig from "@workspace/ui/tailwind.config"
import typography from "@tailwindcss/typography"

const config: Config = {
  ...sharedConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [
    ...(sharedConfig.plugins || []),
    typography
  ]
}

export default config