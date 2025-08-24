import { readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'

export type NewsItem = {
  date: string
  content: string
}

export function getNewsItems(): NewsItem[] {
  const newsDir = path.join(process.cwd(), 'content/news')
  const allNews: NewsItem[] = []
  
  try {
    // Read all year directories
    const years = readdirSync(newsDir)
      .filter(item => {
        const itemPath = path.join(newsDir, item)
        return statSync(itemPath).isDirectory()
      })
      .sort().reverse() // Sort years in reverse (newest first)
    
    // For each year, read all season files
    for (const year of years) {
      const yearDir = path.join(newsDir, year)
      
      try {
        // Read all JSON files in the year directory
        const seasonFiles = readdirSync(yearDir)
          .filter(file => file.endsWith('.json'))
          .sort() // Sort seasons (1spring, 2summer, 3fall, 4winter)
        
        // Load news from each season file
        for (const seasonFile of seasonFiles) {
          try {
            const filePath = path.join(yearDir, seasonFile)
            const fileContent = readFileSync(filePath, 'utf-8')
            const data = JSON.parse(fileContent)
            
            if (data.news && Array.isArray(data.news)) {
              allNews.push(...data.news)
            }
          } catch (error) {
            console.warn(`Failed to load news from ${year}/${seasonFile}:`, error)
          }
        }
      } catch (error) {
        console.warn(`Failed to read year directory ${year}:`, error)
      }
    }
  } catch (error) {
    console.error('Failed to read news directory:', error)
  }
  
  // Sort all news by date descending (newest first)
  return allNews.sort((a, b) => 
    new Date(b.date + "T00:00:00").getTime() - new Date(a.date + "T00:00:00").getTime()
  )
}