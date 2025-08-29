'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Textarea } from '@workspace/ui/components/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Badge } from '@workspace/ui/components/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Copy, Shuffle, Hash, Type, Scissors, AlertCircle } from 'lucide-react'

// We'll dynamically import tokenizers to avoid SSR issues
type TokenizerModule = {
  encode: (text: string) => number[]
  decode: (tokens: number[]) => string
  countTokens?: (text: string) => number
}

type Token = {
  id: number
  text: string
  type: string
  tokenId?: number
}

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Tokenization is the process of breaking text into smaller units called tokens.",
  "Machine learning models can't directly process text; they need numerical representations.",
  "Understanding tokenization helps explain why LLMs struggle with character-level tasks.",
  "🚀 Emojis and special characters can be tokenized differently! 🤖",
  "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
  "The year 2024 marks significant advances in artificial intelligence research."
]

// Simple tokenizers for fallback
const simpleTokenizers = {
  character: {
    name: "Character-level",
    description: "Splits text into individual characters",
    tokenize: (text: string) => {
      return text.split('').map((char, i) => ({
        id: i,
        text: char,
        type: char === ' ' ? 'space' : char.match(/[a-zA-Z]/) ? 'letter' : 'special'
      }))
    }
  },
  whitespace: {
    name: "Whitespace",
    description: "Splits text by spaces and punctuation",
    tokenize: (text: string) => {
      const tokens = text.match(/[\w']+|[^\w\s]+|\s+/g) || []
      return tokens.map((token, i) => ({
        id: i,
        text: token,
        type: token.match(/^\s+$/) ? 'space' : token.match(/^[\w']+$/) ? 'word' : 'punctuation'
      }))
    }
  }
}

export default function TokenizationVisualizer() {
  const [inputText, setInputText] = useState(sampleTexts[0])
  const [selectedTokenizer, setSelectedTokenizer] = useState('whitespace')
  const [tokens, setTokens] = useState<Token[]>([])
  const [hoveredToken, setHoveredToken] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Store loaded tokenizer modules
  const [tokenizers, setTokenizers] = useState<Record<string, TokenizerModule>>({})
  const [availableTokenizers, setAvailableTokenizers] = useState<Record<string, any>>(simpleTokenizers)

  // Load real tokenizers on client side
  useEffect(() => {
    const loadTokenizers = async () => {
      try {
        // Import the main gpt-tokenizer module
        const gptTokenizer = await import('gpt-tokenizer')
        
        // The module exports different encodings
        setTokenizers({
          'gpt': gptTokenizer
        })

        setAvailableTokenizers({
          ...simpleTokenizers,
          'gpt': {
            name: "GPT/ChatGPT (Real)",
            description: "OpenAI's cl100k_base tokenizer used by GPT-3.5/4"
          }
        })

        // Default to GPT tokenizer if loaded
        setSelectedTokenizer('gpt')
        setError(null)
      } catch (err) {
        console.error('Failed to load tokenizers:', err)
        setError('Using simplified tokenizers (real tokenizers require page refresh)')
      }
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      loadTokenizers()
    }
  }, [])

  const tokenizeText = useCallback((text: string, tokenizerType: string) => {
    setError(null)
    setIsLoading(true)
    
    try {
      // Check if it's a real tokenizer
      if (tokenizers[tokenizerType]) {
        const module = tokenizers[tokenizerType]
        const tokenIds = module.encode(text)
        
        // Decode each token individually to get its text representation
        const tokens: Token[] = tokenIds.map((tokenId, index) => {
          try {
            // Decode single token
            const tokenText = module.decode([tokenId])
            return {
              id: index,
              text: tokenText,
              tokenId: tokenId,
              type: detectTokenType(tokenText)
            }
          } catch {
            return {
              id: index,
              text: `[${tokenId}]`,
              tokenId: tokenId,
              type: 'special'
            }
          }
        })
        
        setTokens(tokens)
      } else if (simpleTokenizers[tokenizerType as keyof typeof simpleTokenizers]) {
        // Use simple tokenizer
        const tokenizer = simpleTokenizers[tokenizerType as keyof typeof simpleTokenizers]
        setTokens(tokenizer.tokenize(text))
      }
    } catch (err) {
      console.error('Tokenization error:', err)
      setError('Failed to tokenize text')
      setTokens([])
    } finally {
      setIsLoading(false)
    }
  }, [tokenizers])

  // Detect token type based on content
  const detectTokenType = (text: string): string => {
    if (text.match(/^\s+$/)) return 'space'
    if (text.match(/^[.!?,;:'"()\[\]{}<>\/\\|@#$%^&*+=~`-]+$/)) return 'punctuation'
    if (text.match(/^\d+$/)) return 'number'
    if (text.startsWith('Ġ')) return 'space-prefix' // GPT-2 style space
    if (text.match(/^[A-Z][a-z]*$/)) return 'capitalized'
    if (text.match(/^[a-z]+$/)) return 'lowercase'
    if (text.match(/^[A-Z]+$/)) return 'uppercase'
    if (text.includes('▁')) return 'sentencepiece' // SentencePiece style
    if (text.match(/[^\x00-\x7F]/)) return 'unicode'
    return 'mixed'
  }

  useEffect(() => {
    tokenizeText(inputText, selectedTokenizer)
  }, [inputText, selectedTokenizer, tokenizeText])

  const getTokenColor = (type: string) => {
    const colors: Record<string, string> = {
      word: 'bg-blue-500/20 border-blue-500/50 text-blue-700 dark:text-blue-300',
      space: 'bg-gray-300/20 border-gray-400/50 text-gray-600 dark:text-gray-400',
      'space-prefix': 'bg-gray-400/20 border-gray-500/50 text-gray-700 dark:text-gray-300',
      punctuation: 'bg-purple-500/20 border-purple-500/50 text-purple-700 dark:text-purple-300',
      number: 'bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300',
      letter: 'bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300',
      special: 'bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300',
      capitalized: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-700 dark:text-indigo-300',
      lowercase: 'bg-teal-500/20 border-teal-500/50 text-teal-700 dark:text-teal-300',
      uppercase: 'bg-orange-500/20 border-orange-500/50 text-orange-700 dark:text-orange-300',
      mixed: 'bg-pink-500/20 border-pink-500/50 text-pink-700 dark:text-pink-300',
      unicode: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-300',
      sentencepiece: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-700 dark:text-cyan-300'
    }
    return colors[type] || 'bg-gray-200/20 border-gray-400/50'
  }

  const randomizeSample = () => {
    const currentIndex = sampleTexts.indexOf(inputText)
    let newIndex = Math.floor(Math.random() * sampleTexts.length)
    while (newIndex === currentIndex && sampleTexts.length > 1) {
      newIndex = Math.floor(Math.random() * sampleTexts.length)
    }
    setInputText(sampleTexts[newIndex])
  }

  const copyTokens = () => {
    const tokenText = tokens.map(t => 
      t.tokenId !== undefined ? `[${t.tokenId}]` : `"${t.text}"`
    ).join(' ')
    navigator.clipboard.writeText(tokenText)
  }

  const tokenStats = {
    total: tokens.length,
    unique: new Set(tokens.map(t => t.text)).size,
    avgLength: tokens.length > 0 ? (inputText.length / tokens.length).toFixed(2) : 0,
    types: tokens.reduce((acc, token) => {
      acc[token.type] = (acc[token.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tokenization Visualizer</span>
          <div className="flex gap-2">
            <Button
              onClick={randomizeSample}
              variant="outline"
              size="sm"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Random
            </Button>
            <Button
              onClick={copyTokens}
              variant="outline"
              size="sm"
              disabled={tokens.length === 0}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Text</label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to tokenize..."
            className="min-h-[80px] font-mono text-sm"
          />
        </div>

        {/* Tokenizer Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tokenizer</label>
          <Select value={selectedTokenizer} onValueChange={setSelectedTokenizer}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableTokenizers).map(([key, tokenizer]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <div className="font-medium">{tokenizer.name}</div>
                    <div className="text-xs text-muted-foreground">{tokenizer.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Tabs */}
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="list">Token List</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg min-h-[100px]">
              {isLoading ? (
                <div className="text-center text-muted-foreground">Tokenizing...</div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {tokens.map((token) => (
                    <span
                      key={token.id}
                      className={`inline-flex items-center px-2 py-1 rounded border transition-all cursor-pointer ${
                        getTokenColor(token.type)
                      } ${hoveredToken === token.id ? 'ring-2 ring-primary scale-110 z-10' : ''}`}
                      onMouseEnter={() => setHoveredToken(token.id)}
                      onMouseLeave={() => setHoveredToken(null)}
                      title={token.tokenId !== undefined ? `Token ID: ${token.tokenId}` : token.text}
                    >
                      <span className="font-mono text-sm">
                        {token.text === ' ' ? '␣' : 
                         token.text === '\n' ? '↵' : 
                         token.text === '\t' ? '→' : 
                         token.text === '' ? '∅' :
                         token.text}
                      </span>
                      {token.tokenId !== undefined && (
                        <span className="ml-1 text-xs opacity-50">#{token.tokenId}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(tokenStats.types).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1">
                  <span className={`inline-block w-3 h-3 rounded ${getTokenColor(type)}`} />
                  <span className="text-xs text-muted-foreground">
                    {type.replace('-', ' ')} ({count})
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-2">
            <div className="max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-5 gap-2 text-sm font-medium border-b pb-2 mb-2">
                <div>Index</div>
                <div>Token</div>
                <div>Type</div>
                <div>Length</div>
                <div>Token ID</div>
              </div>
              {tokens.map((token, index) => (
                <div
                  key={token.id}
                  className="grid grid-cols-5 gap-2 text-sm py-1 hover:bg-muted/50 cursor-pointer"
                  onMouseEnter={() => setHoveredToken(token.id)}
                  onMouseLeave={() => setHoveredToken(null)}
                >
                  <div className="text-muted-foreground">#{index}</div>
                  <div className="font-mono truncate" title={token.text}>
                    "{token.text === ' ' ? '␣' : 
                      token.text === '\n' ? '↵' : 
                      token.text === '\t' ? '→' : 
                      token.text === '' ? '∅' :
                      token.text}"
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {token.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">{token.text.length}</div>
                  <div className="text-muted-foreground font-mono">
                    {token.tokenId !== undefined ? token.tokenId : '-'}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{tokenStats.total}</div>
                  <p className="text-xs text-muted-foreground">Total Tokens</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{tokenStats.unique}</div>
                  <p className="text-xs text-muted-foreground">Unique Tokens</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{tokenStats.avgLength}</div>
                  <p className="text-xs text-muted-foreground">Avg Token Length</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Token Type Distribution</h3>
                  {Object.entries(tokenStats.types).map(([type, count]) => {
                    const percentage = ((count / tokenStats.total) * 100).toFixed(1)
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <span className="text-sm w-24">{type.replace('-', ' ')}</span>
                        <div className="flex-1 bg-muted rounded-full h-4 relative overflow-hidden">
                          <div
                            className={`h-full ${getTokenColor(type)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {percentage}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Encoding Info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-sm mb-2">Encoding Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original length:</span>
                    <span className="font-mono">{inputText.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token count:</span>
                    <span className="font-mono">{tokenStats.total} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compression ratio:</span>
                    <span className="font-mono">
                      {(inputText.length / Math.max(1, tokenStats.total)).toFixed(2)}x
                    </span>
                  </div>
                  {selectedTokenizer === 'gpt' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vocabulary size:</span>
                        <span className="font-mono">~100k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Encoding:</span>
                        <span className="font-mono text-xs">cl100k_base</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}