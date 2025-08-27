'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Upload, FileText, BarChart3, AlertCircle } from 'lucide-react'

interface DataPoint {
  x: number
  y: number
}

export function FileUploadAnalyzer() {
  const [fileData, setFileData] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        setFileData(text)
        setError(null)
        
        // Example: Parse CSV data
        const lines = text.trim().split('\n')
        const data = lines.slice(1).map(line => {
          const [x, y] = line.split(',').map(Number)
          return { x, y }
        })
        
        // Perform analysis
        const stats = {
          count: data.length,
          meanX: data.reduce((sum, p) => sum + p.x, 0) / data.length,
          meanY: data.reduce((sum, p) => sum + p.y, 0) / data.length,
          maxX: Math.max(...data.map(p => p.x)),
          maxY: Math.max(...data.map(p => p.y)),
          minX: Math.min(...data.map(p => p.x)),
          minY: Math.min(...data.map(p => p.y)),
        }
        
        setAnalysis({
          data,
          stats
        })
      } catch (err) {
        setError('Failed to parse file. Please ensure it\'s a valid CSV.')
        setAnalysis(null)
      }
    }
    
    reader.readAsText(file)
  }

  const drawChart = (data: DataPoint[]) => {
    // Simple SVG scatter plot
    const width = 400
    const height = 300
    const margin = 40
    
    const xScale = (x: number) => {
      const range = analysis.stats.maxX - analysis.stats.minX
      return margin + ((x - analysis.stats.minX) / range) * (width - 2 * margin)
    }
    
    const yScale = (y: number) => {
      const range = analysis.stats.maxY - analysis.stats.minY
      return height - margin - ((y - analysis.stats.minY) / range) * (height - 2 * margin)
    }
    
    return (
      <svg width={width} height={height} className="border rounded">
        {/* Axes */}
        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="currentColor" strokeOpacity={0.3} />
        
        {/* Data points */}
        {data.map((point, i) => (
          <circle
            key={i}
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r={3}
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
          />
        ))}
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Upload Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Upload a CSV file with x,y data points
              </p>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            {analysis && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data points:</span>
                    <span className="ml-2 font-medium">{analysis.stats.count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mean X:</span>
                    <span className="ml-2 font-medium">{analysis.stats.meanX.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mean Y:</span>
                    <span className="ml-2 font-medium">{analysis.stats.meanY.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Range X:</span>
                    <span className="ml-2 font-medium">[{analysis.stats.minX.toFixed(2)}, {analysis.stats.maxX.toFixed(2)}]</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  {drawChart(analysis.data)}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}