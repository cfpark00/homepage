import researchTreeData from './research-tree.json'

export interface ResearchNode {
  id: string
  title: string
  type: 'question' | 'hypothesis' | 'experiment' | 'observation' | 'thought' | 'work' | 'pivot' | 'idea' | 'finding' | 'literature-review' | 'analysis' | 'eureka' | 'pause'
  description?: string
  date?: string
  children?: ResearchNode[]
  expanded?: boolean
  gridPosition?: { row: number; col: number }  // Optional grid position override
  connections?: string[]  // IDs of connected nodes
  details?: {
    findings?: string[]
    methods?: string[]
    nextSteps?: string[]
    accuracy?: number
    improvement?: string
  }
}

export const researchTree: ResearchNode[] = researchTreeData.researchTree as ResearchNode[]