"use client"

import { useEffect, useRef, useState } from "react"
import { Activity } from "lucide-react"
import * as d3 from "d3"
import { sankey, sankeyLinkHorizontal, sankeyCenter } from "d3-sankey"

interface ResearchNode {
  id: string
  title: string
  type: 'hypothesis' | 'experiment' | 'result' | 'branch'
  description?: string
  date?: string
  children?: ResearchNode[]
  details?: {
    findings?: string[]
    methods?: string[]
    nextSteps?: string[]
    accuracy?: number
    improvement?: string
  }
}

interface SankeyViewProps {
  researchTree: ResearchNode[]
  selectedNode: ResearchNode | null
  onNodeSelect: (node: ResearchNode) => void
}

export function SankeyView({ researchTree, selectedNode, onNodeSelect }: SankeyViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  // Expanded complex data maintaining total height
  const data = {
    nodes: [
      // Column 1 - Starting points
      { node: 0, name: "Research Hypothesis A" },
      { node: 1, name: "Research Hypothesis B" },
      { node: 2, name: "Research Hypothesis C" },
      
      // Column 2 - Experiments
      { node: 3, name: "Experiment 1: ML Model" },
      { node: 4, name: "Experiment 2: Data Analysis" },
      { node: 5, name: "Experiment 3: User Study" },
      { node: 6, name: "Experiment 4: A/B Test" },
      
      // Column 3 - Intermediate Results
      { node: 7, name: "Preliminary Results" },
      { node: 8, name: "Feature Extraction" },
      { node: 9, name: "User Feedback" },
      
      // Column 4 - Final Outcomes
      { node: 10, name: "Publication" },
      { node: 11, name: "Product Feature" },
      { node: 12, name: "Failed Attempt" }
    ],
    links: [
      // Hypothesis A flows
      { source: 0, target: 3, value: 8 },
      { source: 0, target: 4, value: 6 },
      
      // Hypothesis B flows
      { source: 1, target: 4, value: 4 },
      { source: 1, target: 5, value: 10 },
      { source: 1, target: 6, value: 3 },
      
      // Hypothesis C flows
      { source: 2, target: 6, value: 7 },
      { source: 2, target: 3, value: 2 },
      
      // Experiment to intermediate results
      { source: 3, target: 7, value: 6 },
      { source: 3, target: 8, value: 4 },
      { source: 4, target: 7, value: 5 },
      { source: 4, target: 8, value: 5 },
      { source: 5, target: 9, value: 10 },
      { source: 6, target: 9, value: 6 },
      { source: 6, target: 12, value: 4 },
      
      // Intermediate to final results
      { source: 7, target: 10, value: 8 },
      { source: 7, target: 11, value: 3 },
      { source: 8, target: 10, value: 4 },
      { source: 8, target: 11, value: 5 },
      { source: 9, target: 11, value: 12 },
      { source: 9, target: 10, value: 4 }
    ]
  }

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height: 800 })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const MARGIN_X = 50
  const MARGIN_Y = 50

  // Calculate total flow values per column to maintain proportional spacing
  const totalFlowValue = data.links.reduce((sum, link) => sum + link.value, 0)
  const availableHeight = dimensions.height - 2 * MARGIN_Y
  
  // Calculate padding based on number of nodes and total height
  // With 13 nodes total, we need careful spacing calculation
  const totalNodes = data.nodes.length
  const reservedHeightForNodes = totalNodes * 20 // minimum 20px per node
  const availablePaddingSpace = availableHeight - reservedHeightForNodes
  const calculatedPadding = Math.max(8, Math.floor(availablePaddingSpace / (totalNodes - 1)))

  const sankeyGenerator = sankey()
    .nodeWidth(30)
    .nodePadding(calculatedPadding) // Dynamically calculated padding
    .extent([
      [MARGIN_X, MARGIN_Y],
      [dimensions.width - MARGIN_X, dimensions.height - MARGIN_Y]
    ])
    .nodeId((node: any) => node.node)
    .nodeAlign(sankeyCenter)

  const { nodes, links } = sankeyGenerator(data as any)

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  const allNodes = nodes.map((node: any, i) => (
    <g key={i}>
      <rect
        x={node.x0}
        y={node.y0}
        width={node.x1 - node.x0}
        height={node.y1 - node.y0}
        fill={colorScale(i.toString())}
        opacity={0.8}
        stroke="#fff"
        strokeWidth={1}
        rx={2}
      />
      <text
        x={node.x0 < (dimensions.width / 2) ? node.x1 + 6 : node.x0 - 6}
        y={(node.y1 + node.y0) / 2}
        dy="0.35em"
        textAnchor={node.x0 < (dimensions.width / 2) ? "start" : "end"}
        fontSize={11}
        fill="#333"
        fontWeight="500"
      >
        {node.name}
      </text>
    </g>
  ))

  const allLinks = links.map((link: any, i) => {
    const linkGenerator = sankeyLinkHorizontal()
    const path = linkGenerator(link)

    return (
      <path
        key={i}
        d={path!}
        stroke={colorScale(link.source.index.toString())}
        fill="none"
        strokeOpacity={0.4}
        strokeWidth={Math.max(2, link.width)}
        onMouseEnter={(e) => {
          e.currentTarget.style.strokeOpacity = '0.7'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.strokeOpacity = '0.4'
        }}
      />
    )
  })

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur p-3 border-b">
        <Activity className="h-4 w-4" />
        <span className="text-sm font-semibold">Research Tree - Sankey Flow View</span>
      </div>
      
      {/* Sankey Container */}
      <div className="flex-1 overflow-auto p-6 bg-background" ref={containerRef}>
        <svg width={dimensions.width} height={dimensions.height}>
          {allLinks}
          {allNodes}
        </svg>
      </div>
    </div>
  )
}