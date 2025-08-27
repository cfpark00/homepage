import { getThoughts } from "@/lib/thoughts"
import ThoughtsPageClient from "./thoughts-client"

export default async function ThoughtsPage() {
  const dailyThoughts = await getThoughts()
  
  return <ThoughtsPageClient dailyThoughts={dailyThoughts} />
}