import React from 'react'

interface SimpleMarkdownProps {
  content: string
  className?: string
}

export function SimpleMarkdown({ content, className = '' }: SimpleMarkdownProps) {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n')
  
  const renderParagraph = (text: string, key: number) => {
    // Check if it's a numbered list item
    const numberedListMatch = text.match(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*([\s\S]*)$/)
    if (numberedListMatch) {
      const [, number, title, description] = numberedListMatch
      return (
        <div key={key} className="flex gap-3 mb-2">
          <span className="text-sm font-medium text-muted-foreground">{number}.</span>
          <div className="flex-1">
            <span className="text-sm font-medium">{title}:</span>
            <span className="text-sm text-muted-foreground ml-1">
              {renderInlineFormatting(description)}
            </span>
          </div>
        </div>
      )
    }
    
    // Check if it's a heading (starts with **)
    if (text.startsWith('**') && text.endsWith('**')) {
      const headingText = text.slice(2, -2)
      return (
        <h5 key={key} className="text-sm font-medium mb-2">
          {headingText}
        </h5>
      )
    }
    
    // Regular paragraph
    return (
      <p key={key} className={`text-sm text-muted-foreground leading-relaxed ${className}`}>
        {renderInlineFormatting(text)}
      </p>
    )
  }
  
  const renderInlineFormatting = (text: string) => {
    // Split by bold markers and process
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) => {
      // Odd indices are bold text
      if (i % 2 === 1) {
        return <strong key={i} className="font-medium text-foreground">{part}</strong>
      }
      return part
    })
  }
  
  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, i) => renderParagraph(paragraph.trim(), i))}
    </div>
  )
}