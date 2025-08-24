"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Search } from "lucide-react"
import { publications } from "@/lib/publications-data"
import { PublicationCard } from "@/components/publication-card"

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSignificant, setShowSignificant] = useState(true)

  const filteredPublications = useMemo(() => {
    return publications
      .filter(pub => !pub.hide) // Filter out hidden publications
      .filter(pub => {
        const matchesSearch = searchTerm === "" || 
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pub.abstract && pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()))
        
        const matchesSignificant = !showSignificant || pub.significant
        
        return matchesSearch && matchesSignificant
      })
      .sort((a, b) => {
        // Sort by year first (descending)
        if (b.year !== a.year) return b.year - a.year
        // Then by month if available
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December']
        const aMonth = a.month ? monthOrder.indexOf(a.month) : -1
        const bMonth = b.month ? monthOrder.indexOf(b.month) : -1
        return bMonth - aMonth
      })
  }, [searchTerm, showSignificant])

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Publications</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or abstract..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <p className="text-sm text-muted-foreground mr-4">
                Showing {filteredPublications.length} of {publications.length} publications
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="significant" 
                  checked={showSignificant}
                  onCheckedChange={(checked) => setShowSignificant(checked as boolean)}
                />
                <label
                  htmlFor="significant"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Significant contributions only
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filteredPublications.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>

        {filteredPublications.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No publications found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}