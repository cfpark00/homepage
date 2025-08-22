"use client"

import { useRef } from "react"
import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react"
import { GitCommit } from "lucide-react"

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

interface GitGraphViewProps {
  researchTree: ResearchNode[]
  selectedNode: ResearchNode | null
  onNodeSelect: (node: ResearchNode) => void
}

export function GitGraphView({ researchTree, selectedNode, onNodeSelect }: GitGraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Map node types to colors
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'hypothesis': return '#eab308' // yellow-500
      case 'experiment': return '#3b82f6' // blue-500
      case 'result': return '#10b981' // green-500
      default: return '#a855f7' // purple-500
    }
  }

  // Create custom template with branch labels
  const customTemplate = templateExtend(TemplateName.Metro, {
    colors: ['#a855f7', '#3b82f6', '#10b981', '#eab308', '#ef4444'],
    branch: {
      lineWidth: 4,
      spacing: 50,
      label: {
        display: true,
        bgColor: '#ffffff', 
        color: '#333333',
        borderRadius: 3,
        font: 'normal 11px sans-serif',
      },
    },
    commit: {
      spacing: 60,
      dot: {
        size: 12,
      },
      message: {
        font: 'normal 12px sans-serif',
      },
    },
  })

  return (
    <div ref={containerRef} className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur p-3 border-b">
        <GitCommit className="h-4 w-4" />
        <span className="text-sm font-semibold">Research Tree - Git Graph View</span>
      </div>
      
      {/* Graph Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-background">
        <div className="min-w-max">
          <Gitgraph
          options={{
            template: customTemplate,
            mode: 'compact' as any,
            orientation: 'horizontal' as any,
          } as any}
      >
        {(gitgraph) => {
          // Create main branch
          const master = gitgraph.branch("main")
          master.commit("Research Initiative Started")

          // Process research tree nodes
          const processNode = (
            node: ResearchNode, 
            parentBranch: any, 
            depth: number = 0,
            branchName?: string
          ) => {
            const nodeBranchName = branchName || node.title.toLowerCase().replace(/\s+/g, '-')
            
            if (node.type === 'branch' && node.children && node.children.length > 0) {
              // Create a new branch for branch nodes with children
              const branch = parentBranch.branch(nodeBranchName)
              
              branch.commit({
                subject: node.title,
                body: node.description,
                onClick: () => onNodeSelect(node),
              })

              // Process children
              node.children.forEach((child, index) => {
                processNode(child, branch, depth + 1, `${nodeBranchName}-${index}`)
              })

              // Merge successful results back to parent
              if (node.children.some(child => child.type === 'result')) {
                parentBranch.merge(branch, `Merged: ${node.title}`)
              }
            } else {
              // Direct commit for leaf nodes or experiments/results
              parentBranch.commit({
                subject: node.title + (node.details?.accuracy ? ` (${node.details.accuracy}%)` : ''),
                body: node.description,
                onClick: () => onNodeSelect(node),
              })

              // Process children if any
              if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                  processNode(child, parentBranch, depth + 1)
                })
              }
            }
          }

          // Process all root nodes
          researchTree.forEach(rootNode => {
            processNode(rootNode, master, 0)
          })

          // Add final commit
          master.commit("Current State")
        }}
        </Gitgraph>
        </div>
      </div>
    </div>
  )
}