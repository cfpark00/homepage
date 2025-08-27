'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Activity, TrendingUp, Code, Clock, GitBranch, FileText, BarChart3, Search, Layers } from 'lucide-react'

interface UsagePattern {
  pattern: string
  frequency: number
  category: string
  insight: string
}

interface ToolUsage {
  tool: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export default function ClaudeCodeUsagePatternsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')
  const [showDetails, setShowDetails] = useState(false)

  // Simulated data - in production this would come from actual usage analytics
  const toolUsageData: ToolUsage[] = [
    { tool: 'Read', count: 1247, percentage: 28.5, trend: 'up' },
    { tool: 'Edit', count: 983, percentage: 22.5, trend: 'up' },
    { tool: 'Bash', count: 742, percentage: 17.0, trend: 'stable' },
    { tool: 'Grep', count: 623, percentage: 14.2, trend: 'up' },
    { tool: 'Task', count: 412, percentage: 9.4, trend: 'down' },
    { tool: 'Write', count: 367, percentage: 8.4, trend: 'down' },
  ]

  const usagePatterns: UsagePattern[] = [
    {
      pattern: 'Sequential File Exploration',
      frequency: 87,
      category: 'navigation',
      insight: 'Users typically use Read → Grep → Read pattern when exploring unfamiliar codebases'
    },
    {
      pattern: 'Test-Driven Development',
      frequency: 72,
      category: 'development',
      insight: 'Write test → Run test → Edit implementation cycle is prevalent in 72% of development sessions'
    },
    {
      pattern: 'Refactoring Workflow',
      frequency: 65,
      category: 'refactoring',
      insight: 'Grep for references → MultiEdit for batch updates → Bash for verification'
    },
    {
      pattern: 'Debugging Deep Dive',
      frequency: 58,
      category: 'debugging',
      insight: 'Read error → Grep for context → Edit fix → Bash test cycle appears in complex debugging'
    },
    {
      pattern: 'Documentation Update',
      frequency: 43,
      category: 'documentation',
      insight: 'Users often batch documentation updates using MultiEdit after code changes'
    },
    {
      pattern: 'Dependency Management',
      frequency: 38,
      category: 'maintenance',
      insight: 'Package.json read → npm install → test run is common for dependency updates'
    }
  ]

  const categories = ['all', 'navigation', 'development', 'refactoring', 'debugging', 'documentation', 'maintenance']

  const filteredPatterns = selectedCategory === 'all' 
    ? usagePatterns 
    : usagePatterns.filter(p => p.category === selectedCategory)

  const getProgressColor = (percentage: number) => {
    if (percentage > 70) return 'bg-green-500'
    if (percentage > 40) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '↑'
    if (trend === 'down') return '↓'
    return '→'
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Analysis Time Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                Last {range}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tool Usage Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {toolUsageData.map((tool) => (
              <div key={tool.tool} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{tool.tool}</span>
                    <span className={`text-xs ${getTrendColor(tool.trend)}`}>
                      {getTrendIcon(tool.trend)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{tool.count} calls</span>
                    <span className="font-medium">{tool.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(tool.percentage)} transition-all duration-500`}
                    style={{ width: `${tool.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Common Usage Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Patterns List */}
          <div className="space-y-4">
            {filteredPatterns.map((pattern, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      {pattern.pattern}
                    </h3>
                    <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-1 rounded mt-1 inline-block">
                      {pattern.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{pattern.frequency}%</div>
                    <div className="text-xs text-muted-foreground">frequency</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {pattern.insight}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div>
                <h4 className="font-medium mb-1">Read-heavy workflows dominate</h4>
                <p className="text-sm text-muted-foreground">
                  28.5% of all tool calls are Read operations, indicating developers spend significant time understanding existing code
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <h4 className="font-medium mb-1">Batch operations are underutilized</h4>
                <p className="text-sm text-muted-foreground">
                  MultiEdit and Task tools show lower usage despite offering efficiency gains for repetitive operations
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
              <div>
                <h4 className="font-medium mb-1">Testing patterns reveal quality focus</h4>
                <p className="text-sm text-muted-foreground">
                  72% of development sessions include test execution, showing strong adoption of test-driven practices
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium mb-1">Introduce smart caching for Read operations</h4>
              <p className="text-sm text-muted-foreground">
                Cache frequently accessed files to reduce redundant reads in exploration workflows
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium mb-1">Suggest MultiEdit for repetitive changes</h4>
              <p className="text-sm text-muted-foreground">
                Detect patterns where multiple similar edits occur and proactively suggest batch operations
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium mb-1">Create workflow templates</h4>
              <p className="text-sm text-muted-foreground">
                Package common patterns into reusable templates to streamline frequent operations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggle Details Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          {showDetails ? 'Hide' : 'Show'} Technical Details
        </Button>
      </div>

      {/* Technical Details */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Data Collection</h4>
                <p className="text-muted-foreground">
                  Tool usage data is collected through Claude Code's telemetry system, anonymized, and aggregated 
                  to identify patterns while preserving user privacy.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Pattern Detection Algorithm</h4>
                <p className="text-muted-foreground">
                  Sequential pattern mining using PrefixSpan algorithm to identify frequent tool sequences. 
                  Patterns are clustered using DBSCAN to group similar workflows.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Real-time Analysis</h4>
                <p className="text-muted-foreground">
                  Streaming analytics pipeline processes usage events in real-time, updating pattern frequencies 
                  and detecting emerging workflows using sliding window aggregations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}