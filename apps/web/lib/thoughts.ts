import fs from "fs"
import path from "path"

export interface ThoughtItem {
  id: number
  content: string
  time: string
  tags?: string[]
  parent_id?: [string, number] // tuple of (date, id) to link to other thoughts
}

export interface DailyThoughts {
  date: string
  title: string
  thoughts: ThoughtItem[]
}

const thoughtsDirectory = path.join(process.cwd(), 'content/thoughts')

export async function getThoughts(): Promise<DailyThoughts[]> {
  // Ensure directory exists
  if (!fs.existsSync(thoughtsDirectory)) {
    return []
  }

  // Get all JSON files
  const fileNames = fs.readdirSync(thoughtsDirectory)
    .filter(fileName => fileName.endsWith(".json"))
  
  const dailyThoughts = fileNames
    .map(fileName => {
      // Extract date from filename (YYYY-MM-DD.json)
      const date = fileName.replace(".json", "")
      
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return null
      }
      
      const fullPath = path.join(thoughtsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      
      try {
        const data = JSON.parse(fileContents)
        return {
          date,
          title: data.title || "Untitled",
          thoughts: data.thoughts || []
        }
      } catch (error) {
        console.error(`Error parsing ${fileName}:`, error)
        return null
      }
    })
    .filter((thought): thought is DailyThoughts => thought !== null)
    .sort((a, b) => b.date.localeCompare(a.date)) // Sort by date, newest first
  
  return dailyThoughts
}

export async function getThought(date: string): Promise<DailyThoughts | null> {
  const filePath = path.join(thoughtsDirectory, `${date}.json`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(filePath, "utf8")
  
  try {
    const data = JSON.parse(fileContents)
    return {
      date,
      title: data.title || "Untitled",
      thoughts: data.thoughts || []
    }
  } catch (error) {
    console.error(`Error parsing thought for ${date}:`, error)
    return null
  }
}