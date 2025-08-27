'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Upload, FileArchive, FileText, AlertCircle, CheckCircle, BarChart3, Clock, Calendar, Activity, TrendingUp, Loader2 } from 'lucide-react'


interface ConversationData {
  filename: string
  start: string | null
  end: string | null
  duration: number // in seconds
  messageCount: number
}

interface AnalysisResults {
  totalFiles: number
  jsonlFiles: string[]
  jsonlCount: number
  conversations: ConversationData[]
  totalDuration: number // in seconds
  averageDuration: number // in seconds
  earliestDate: string | null
  latestDate: string | null
  hourlyDistribution: number[] // 24 hours
  dailyActivity: { date: string; count: number; duration: number }[]
}

export function ZipAnalyzer() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState<'uploading' | 'unzipping' | 'analyzing' | null>(null)
  const [foundCount, setFoundCount] = useState<number>(0)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${month}/${day}/${year}`
  }

  const getHourLabel = (hour: number): string => {
    if (hour === 0) return '12am'
    if (hour === 12) return '12pm'
    if (hour < 12) return `${hour}am`
    return `${hour - 12}pm`
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Please select a ZIP file')
      return
    }

    setIsProcessing(true)
    setProcessingStage('uploading')
    setError(null)
    setResults(null)
    setFoundCount(0)

    try {
      // Dynamically import JSZip (for client-side only)
      const JSZip = (await import('jszip')).default
      
      // Read the file as ArrayBuffer
      setProcessingStage('unzipping')
      const arrayBuffer = await file.arrayBuffer()
      
      // Load the zip file
      const zip = new JSZip()
      const contents = await zip.loadAsync(arrayBuffer)
      
      // Find and analyze JSONL files
      const jsonlFiles: string[] = []
      const conversations: ConversationData[] = []
      let totalFiles = 0
      const hourlyDistribution = new Array(24).fill(0)
      const dailyMap = new Map<string, { count: number; duration: number }>()
      
      // First pass: count JSONL files
      for (const [filename, file] of Object.entries(contents.files)) {
        if (!file.dir) {
          // Skip __MACOSX metadata files
          if (filename.startsWith('__MACOSX/')) {
            continue
          }
          
          totalFiles++
          
          // Check for JSONL files
          if (filename.toLowerCase().endsWith('.jsonl')) {
            // Get the directory depth by counting slashes
            const slashCount = (filename.match(/\//g) || []).length
            
            // Only include if it's in root (0 slashes) or first-level directory (1 slash)
            if (slashCount <= 1) {
              jsonlFiles.push(filename)
            }
          }
        }
      }
      
      // Set found count and switch to analyzing stage
      setFoundCount(jsonlFiles.length)
      if (jsonlFiles.length > 0) {
        setProcessingStage('analyzing')
      }
      
      // Second pass: analyze each JSONL file
      for (const filename of jsonlFiles) {
        const file = contents.files[filename]
        
        // Read and analyze the JSONL file
        try {
          const content = await file.async('text')
          const lines = content.trim().split('\n')
          const timestamps: string[] = []
          let messageCount = 0
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line)
              if (data.timestamp) {
                timestamps.push(data.timestamp)
                
                // Track hourly distribution
                const hour = new Date(data.timestamp).getUTCHours()
                hourlyDistribution[hour]++
              }
              if (data.type === 'user' || data.type === 'assistant') {
                messageCount++
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
          
          let start: string | null = null
          let end: string | null = null
          let duration = 0
          
          if (timestamps.length > 0) {
            start = timestamps[0]
            end = timestamps[timestamps.length - 1]
            const startDate = new Date(start)
            const endDate = new Date(end)
            duration = (endDate.getTime() - startDate.getTime()) / 1000
            
            // Track daily activity
            const dateStr = startDate.toISOString().split('T')[0]
            const existing = dailyMap.get(dateStr) || { count: 0, duration: 0 }
            dailyMap.set(dateStr, {
              count: existing.count + 1,
              duration: existing.duration + duration
            })
          }
          
          conversations.push({
            filename: filename.split('/').pop() || filename,
            start,
            end,
            duration,
            messageCount
          })
        } catch (err) {
          console.error(`Error processing ${filename}:`, err)
        }
      }
      
      // Calculate aggregated statistics
      const totalDuration = conversations.reduce((sum, c) => sum + c.duration, 0)
      const averageDuration = conversations.length > 0 ? totalDuration / conversations.length : 0
      
      // Find earliest and latest dates
      const allDates = conversations
        .filter(c => c.start)
        .map(c => new Date(c.start!).getTime())
        .sort((a, b) => a - b)
      
      const earliestDate = allDates.length > 0 ? new Date(allDates[0]).toISOString() : null
      const latestDate = allDates.length > 0 ? 
        new Date(Math.max(...conversations.filter(c => c.end).map(c => new Date(c.end!).getTime()))).toISOString() : null
      
      // Convert daily map to array
      const dailyActivity = Array.from(dailyMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))
      
      setResults({
        totalFiles,
        jsonlFiles,
        jsonlCount: jsonlFiles.length,
        conversations,
        totalDuration,
        averageDuration,
        earliestDate,
        latestDate,
        hourlyDistribution,
        dailyActivity
      })
      
    } catch (err) {
      console.error('Error processing zip:', err)
      setError('Failed to process ZIP file. Please ensure it\'s a valid ZIP archive.')
    } finally {
      setIsProcessing(false)
      setProcessingStage(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          This tool analyzes your Claude Code conversation history to reveal your coding patterns and productivity insights. 
          Upload your exported conversations to see when you code most, how long your sessions last, and your activity trends over time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileArchive className="h-5 w-5" />
            Conversation Analytics
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-2">
            Zip a project folder found at <code className="bg-muted px-1 py-0.5 rounded">.claude/projects/[project-name]</code>, 
            then upload the resulting ZIP file
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Upload Conversation Export'}
              </Button>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            {/* Processing Status */}
            {isProcessing && (
              <div className="space-y-3">
                {processingStage === 'uploading' && (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm">Uploading file...</span>
                  </div>
                )}
                
                {processingStage === 'unzipping' && (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm">Unzipping archive...</span>
                  </div>
                )}
                
                {processingStage === 'analyzing' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Found {foundCount} conversations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm">Analyzing conversation data...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Results Display */}
            {results && results.jsonlCount > 0 && !isProcessing && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Analysis complete! Found {results.jsonlCount} conversations</span>
                </div>
                
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" />
                      <p className="text-xs">Conversations</p>
                    </div>
                    <p className="text-2xl font-bold">{results.jsonlCount}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      <p className="text-xs">Total Time</p>
                    </div>
                    <p className="text-2xl font-bold">{formatDuration(results.totalDuration)}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Activity className="h-4 w-4" />
                      <p className="text-xs">Avg Duration</p>
                    </div>
                    <p className="text-2xl font-bold">{formatDuration(results.averageDuration)}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-xs">Time Span</p>
                    </div>
                    <p className="text-lg font-bold">
                      {results.earliestDate && results.latestDate ? 
                        `${Math.ceil((new Date(results.latestDate).getTime() - new Date(results.earliestDate).getTime()) / (1000 * 60 * 60 * 24))} days` 
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Hourly Activity Chart */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Activity by Hour (UTC)
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of messages sent per hour
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full overflow-x-auto">
                      <svg width="100%" height="200" viewBox="0 0 600 200" className="min-w-[500px]">
                        {(() => {
                          const maxCount = Math.max(...results.hourlyDistribution)
                          const barWidth = 20
                          const barSpacing = 25
                          const chartHeight = 120
                          const topPadding = 20
                          
                          return (
                            <>
                              {/* Grid lines */}
                              {[0, 25, 50, 75, 100].map(percent => (
                                <line
                                  key={percent}
                                  x1="0"
                                  y1={topPadding + chartHeight - (chartHeight * percent / 100)}
                                  x2="600"
                                  y2={topPadding + chartHeight - (chartHeight * percent / 100)}
                                  stroke="currentColor"
                                  strokeOpacity="0.1"
                                  strokeDasharray="2,2"
                                />
                              ))}
                              
                              {/* Bars */}
                              {results.hourlyDistribution.map((count, hour) => {
                                const height = maxCount > 0 ? (count / maxCount) * chartHeight : 0
                                const x = hour * barSpacing + 10
                                const y = topPadding + chartHeight - height
                                
                                return (
                                  <g key={hour}>
                                    {/* Bar */}
                                    <rect
                                      x={x}
                                      y={y}
                                      width={barWidth}
                                      height={height}
                                      fill="hsl(var(--primary))"
                                      opacity="0.8"
                                      className="hover:opacity-100 transition-opacity"
                                    />
                                    
                                    {/* Value label on top of bar */}
                                    {count > 0 && (
                                      <text
                                        x={x + barWidth / 2}
                                        y={y - 5}
                                        fontSize="10"
                                        fill="currentColor"
                                        textAnchor="middle"
                                        opacity="0.6"
                                      >
                                        {count}
                                      </text>
                                    )}
                                    
                                    {/* X-axis label */}
                                    <text
                                      x={x + barWidth / 2}
                                      y={topPadding + chartHeight + 15}
                                      fontSize="11"
                                      fill="currentColor"
                                      textAnchor="end"
                                      transform={`rotate(-45 ${x + barWidth / 2} ${topPadding + chartHeight + 15})`}
                                      opacity="0.6"
                                    >
                                      {getHourLabel(hour)}
                                    </text>
                                  </g>
                                )
                              })}
                              
                              {/* X-axis line */}
                              <line
                                x1="0"
                                y1={topPadding + chartHeight}
                                x2="600"
                                y2={topPadding + chartHeight}
                                stroke="currentColor"
                                strokeOpacity="0.2"
                              />
                            </>
                          )
                        })()}
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Activity Timeline */}
                {results.dailyActivity.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Daily Activity
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Conversations per day (number) • Total duration (bar height)
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full overflow-x-auto">
                        <svg 
                          width="100%" 
                          height="200" 
                          viewBox={`0 0 ${Math.max(600, results.dailyActivity.length * 50)} 200`} 
                          className={`${results.dailyActivity.length > 12 ? 'min-w-[600px]' : ''}`}
                        >
                          {(() => {
                            const maxDuration = Math.max(...results.dailyActivity.map(d => d.duration))
                            const barWidth = 30
                            const barSpacing = 50
                            const chartHeight = 120
                            const topPadding = 20
                            
                            return (
                              <>
                                {/* Grid lines */}
                                {[0, 25, 50, 75, 100].map(percent => (
                                  <line
                                    key={percent}
                                    x1="0"
                                    y1={topPadding + chartHeight - (chartHeight * percent / 100)}
                                    x2={results.dailyActivity.length * barSpacing}
                                    y2={topPadding + chartHeight - (chartHeight * percent / 100)}
                                    stroke="currentColor"
                                    strokeOpacity="0.1"
                                    strokeDasharray="2,2"
                                  />
                                ))}
                                
                                {/* Bars */}
                                {results.dailyActivity.map((day, index) => {
                                  const height = maxDuration > 0 ? (day.duration / maxDuration) * chartHeight : 0
                                  const x = index * barSpacing + 10
                                  const y = topPadding + chartHeight - height
                                  
                                  return (
                                    <g key={day.date}>
                                      {/* Bar */}
                                      <rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={height}
                                        fill="rgb(59, 130, 246)" // blue-500
                                        opacity="0.8"
                                        className="hover:opacity-100 transition-opacity"
                                      />
                                      
                                      {/* Count label on top */}
                                      <text
                                        x={x + barWidth / 2}
                                        y={y - 5}
                                        fontSize="10"
                                        fill="currentColor"
                                        textAnchor="middle"
                                        opacity="0.6"
                                      >
                                        {day.count}
                                      </text>
                                      
                                      {/* Date label */}
                                      <text
                                        x={x + barWidth / 2}
                                        y={topPadding + chartHeight + 15}
                                        fontSize="11"
                                        fill="currentColor"
                                        textAnchor="end"
                                        transform={`rotate(-45 ${x + barWidth / 2} ${topPadding + chartHeight + 15})`}
                                        opacity="0.6"
                                      >
                                        {formatDate(day.date)}
                                      </text>
                                      
                                      {/* Duration label below date */}
                                      <text
                                        x={x + barWidth / 2}
                                        y={topPadding + chartHeight + 30}
                                        fontSize="9"
                                        fill="currentColor"
                                        textAnchor="end"
                                        transform={`rotate(-45 ${x + barWidth / 2} ${topPadding + chartHeight + 30})`}
                                        opacity="0.4"
                                      >
                                        {formatDuration(day.duration)}
                                      </text>
                                    </g>
                                  )
                                })}
                                
                                {/* X-axis line */}
                                <line
                                  x1="0"
                                  y1={topPadding + chartHeight}
                                  x2={results.dailyActivity.length * barSpacing}
                                  y2={topPadding + chartHeight}
                                  stroke="currentColor"
                                  strokeOpacity="0.2"
                                />
                              </>
                            )
                          })()}
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {results && results.jsonlCount === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No JSONL files found in this ZIP archive
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

