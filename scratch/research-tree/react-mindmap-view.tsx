"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

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

interface ReactMindmapViewProps {
  researchTree: ResearchNode[]
  selectedNode: ResearchNode | null
  onNodeSelect: (node: ResearchNode) => void
}

export function ReactMindmapView({ researchTree, selectedNode, onNodeSelect }: ReactMindmapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!svgRef.current || !researchTree.length) return
    
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()
    
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
    
    // Create a hierarchical layout
    const root = d3.hierarchy({
      id: 'root',
      title: 'Research',
      type: 'branch' as const,
      children: researchTree
    })
    
    // Create tree layout
    const treeLayout = d3.tree<any>()
      .size([height - 100, width - 200])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2))
    
    treeLayout(root as any)
    
    // Add container with zoom capability
    const g = svg.append("g")
      .attr("transform", "translate(100,50)")
    
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })
    
    svg.call(zoom as any)
    
    // Draw links
    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => (d as any).y)
        .y(d => (d as any).x) as any)
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
    
    // Draw nodes
    const node = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${(d as any).y},${(d as any).x})`)
    
    // Add circles for nodes
    node.append("circle")
      .attr("r", (d: any) => d.children ? 8 : 6)
      .attr("fill", (d: any) => {
        const nodeData = d.data as ResearchNode
        switch (nodeData.type) {
          case 'hypothesis': return '#fbbf24'
          case 'experiment': return '#3b82f6'
          case 'result': return '#10b981'
          default: return '#a855f7'
        }
      })
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation()
        const nodeData = d.data as ResearchNode
        if (nodeData.id !== 'root') {
          onNodeSelect(nodeData)
        }
      })
    
    // Add labels
    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.children ? -12 : 12)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .text((d: any) => (d.data as ResearchNode).title)
      .style("font-size", "12px")
      .style("fill", "currentColor")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation()
        const nodeData = d.data as ResearchNode
        if (nodeData.id !== 'root') {
          onNodeSelect(nodeData)
        }
      })
    
    // Highlight selected node
    if (selectedNode) {
      node.selectAll("circle")
        .attr("stroke-width", (d: any) => {
          const nodeData = d.data as ResearchNode
          return nodeData.id === selectedNode.id ? 4 : 2
        })
        .attr("stroke", (d: any) => {
          const nodeData = d.data as ResearchNode
          return nodeData.id === selectedNode.id ? "#6366f1" : "white"
        })
    }
    
  }, [researchTree, selectedNode, onNodeSelect])
  
  return (
    <div className="h-full w-full bg-background">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  )
}