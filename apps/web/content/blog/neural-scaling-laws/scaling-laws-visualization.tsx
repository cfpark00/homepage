'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Card } from '@workspace/ui/components/card'
import { Label } from '@workspace/ui/components/label'
import { Slider } from '@workspace/ui/components/slider'
import { Button } from '@workspace/ui/components/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

interface ScalingParams {
  L0: number
  Nc: number
  Dc: number
  alphaN: number
  alphaD: number
}

const defaultParams: ScalingParams = {
  L0: 1.69,
  Nc: 4.714e7,
  Dc: 2.158e9,
  alphaN: 0.34,
  alphaD: 0.28,
}

type XAxisType = 'parameters' | 'compute' | 'data'
type YAxisType = 'loss' | 'compute' | 'data'

export default function ScalingLawsVisualization() {
  const [params, setParams] = useState<ScalingParams>(defaultParams)
  const [xAxis, setXAxis] = useState<XAxisType>('parameters')
  const [yAxis, setYAxis] = useState<YAxisType>('loss')
  const [showOptimal, setShowOptimal] = useState(true)
  const [showInfinite, setShowInfinite] = useState(true)
  const [fixedCompute, setFixedCompute] = useState<number[]>([1e20, 1e21, 1e22])

  // Calculate loss given N parameters and C compute
  const getLoss = useCallback((N: number, C: number, params: ScalingParams): number => {
    const { L0, Nc, Dc, alphaN, alphaD } = params
    const D = C / (6 * N) // Constraint: C = 6ND
    return L0 + Math.pow(Nc / N, alphaN) + Math.pow(Dc / D, alphaD)
  }, [])

  // Find compute-optimal frontier
  const findOptimalC = useCallback((N: number, params: ScalingParams): { C: number; L: number } => {
    const { Nc, Dc, alphaN, alphaD, L0 } = params
    // Derived formula for C where N is the minimizer
    const C = 6 * Dc * Math.pow(alphaD / alphaN, 1 / alphaD) * 
              Math.pow(N / Nc, alphaN / alphaD) * N
    const L = getLoss(N, C, params)
    return { C, L }
  }, [getLoss])

  // Generate data points
  const data = useMemo(() => {
    const nValues = Array.from({ length: 100 }, (_, i) => 
      Math.pow(10, 7 + (i / 99) * 6) // From 10^7 to 10^13
    )

    const points = nValues.map(N => {
      const optimal = findOptimalC(N, params)
      const infiniteLoss = params.L0 + Math.pow(params.Nc / N, params.alphaN)
      
      // Calculate for fixed compute budgets
      const fixedC = fixedCompute.reduce((acc, C) => {
        acc[`C_${C.toExponential(0)}`] = getLoss(N, C, params)
        return acc
      }, {} as Record<string, number>)

      // Calculate data tokens D for optimal compute
      const D_optimal = optimal.C / (6 * N)

      return {
        N,
        C_optimal: optimal.C,
        L_optimal: optimal.L,
        L_infinite: infiniteLoss,
        D_optimal,
        ...fixedC
      } as Record<string, number>
    })

    return points
  }, [params, fixedCompute, findOptimalC, getLoss])

  // Transform data based on selected axes
  const transformedData = useMemo(() => {
    return data.map(point => {
      let xValue: number
      let yValue: number

      // Transform X axis
      switch (xAxis) {
        case 'parameters':
          xValue = point.N
          break
        case 'compute':
          xValue = point.C_optimal
          break
        case 'data':
          xValue = point.D_optimal
          break
      }

      // Transform Y axis
      switch (yAxis) {
        case 'loss':
          yValue = point.L_optimal
          break
        case 'compute':
          yValue = point.C_optimal
          break
        case 'data':
          yValue = point.D_optimal
          break
      }

      return {
        x: xValue,
        y_optimal: yValue,
        y_infinite: yAxis === 'loss' ? point.L_infinite : undefined,
        ...Object.keys(point)
          .filter(key => key.startsWith('C_'))
          .reduce((acc, key) => {
            acc[`y_${key}`] = yAxis === 'loss' ? (point as any)[key] : undefined
            return acc
          }, {} as Record<string, number | undefined>)
      }
    })
  }, [data, xAxis, yAxis])

  const formatAxisValue = (value: number, type: XAxisType | YAxisType) => {
    if (type === 'loss') {
      return value.toFixed(2)
    }
    // For parameters, compute, data - use scientific notation
    if (value < 1e3) return value.toFixed(0)
    if (value < 1e6) return `${(value / 1e3).toFixed(0)}K`
    if (value < 1e9) return `${(value / 1e6).toFixed(0)}M`
    if (value < 1e12) return `${(value / 1e9).toFixed(0)}B`
    if (value < 1e15) return `${(value / 1e12).toFixed(0)}T`
    return value.toExponential(1)
  }

  const getAxisLabel = (type: XAxisType | YAxisType) => {
    switch (type) {
      case 'parameters': return 'Model Parameters (N)'
      case 'compute': return 'Compute (FLOPs)'
      case 'data': return 'Data Tokens (D)'
      case 'loss': return 'Loss'
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scaling Law Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>L₀ (Irreducible Loss): {params.L0.toFixed(2)}</Label>
            <Slider
              value={[params.L0]}
              onValueChange={([v]) => setParams({ ...params, L0: v })}
              min={1}
              max={3}
              step={0.01}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Nᶜ (Parameter Scale): {params.Nc.toExponential(2)}</Label>
            <Slider
              value={[Math.log10(params.Nc)]}
              onValueChange={([v]) => setParams({ ...params, Nc: Math.pow(10, v) })}
              min={6}
              max={9}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label>Dᶜ (Data Scale): {params.Dc.toExponential(2)}</Label>
            <Slider
              value={[Math.log10(params.Dc)]}
              onValueChange={([v]) => setParams({ ...params, Dc: Math.pow(10, v) })}
              min={8}
              max={11}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label>αₙ (Parameter Exponent): {params.alphaN.toFixed(2)}</Label>
            <Slider
              value={[params.alphaN]}
              onValueChange={([v]) => setParams({ ...params, alphaN: v })}
              min={0.1}
              max={0.6}
              step={0.01}
            />
          </div>

          <div className="space-y-2">
            <Label>αᴅ (Data Exponent): {params.alphaD.toFixed(2)}</Label>
            <Slider
              value={[params.alphaD]}
              onValueChange={([v]) => setParams({ ...params, alphaD: v })}
              min={0.1}
              max={0.6}
              step={0.01}
            />
          </div>

          <div className="flex items-end">
            <Button onClick={() => setParams(defaultParams)} variant="outline">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Axis Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>X-Axis</Label>
            <div className="flex gap-2">
              {(['parameters', 'compute', 'data'] as XAxisType[]).map(type => (
                <Button
                  key={type}
                  variant={xAxis === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setXAxis(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Y-Axis</Label>
            <div className="flex gap-2">
              {(['loss', 'compute', 'data'] as YAxisType[]).map(type => (
                <Button
                  key={type}
                  variant={yAxis === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setYAxis(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOptimal}
              onChange={(e) => setShowOptimal(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show Compute-Optimal Frontier</span>
          </label>

          {yAxis === 'loss' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInfinite}
                onChange={(e) => setShowInfinite(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Infinite Compute Limit</span>
            </label>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scaling Law Visualization</h3>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              scale="log"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(v) => formatAxisValue(v, xAxis)}
              label={{ value: getAxisLabel(xAxis), position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              scale={yAxis === 'loss' ? 'log' : 'log'}
              domain={['dataMin', 'dataMax']}
              tickFormatter={(v) => formatAxisValue(v, yAxis)}
              label={{ value: getAxisLabel(yAxis), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name.includes('Optimal')) return [`${formatAxisValue(value, yAxis)}`, 'Compute-Optimal']
                if (name.includes('Infinite')) return [`${formatAxisValue(value, yAxis)}`, 'Infinite Compute']
                return [`${formatAxisValue(value, yAxis)}`, name]
              }}
              labelFormatter={(value) => `${getAxisLabel(xAxis)}: ${formatAxisValue(value as number, xAxis)}`}
            />
            <Legend />

            {showOptimal && (
              <Line
                type="monotone"
                dataKey="y_optimal"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={false}
                name="Compute-Optimal Frontier"
              />
            )}

            {showInfinite && yAxis === 'loss' && (
              <Line
                type="monotone"
                dataKey="y_infinite"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={false}
                name="Infinite Compute Limit"
              />
            )}

            {yAxis === 'loss' && fixedCompute.map((C, i) => (
              <Line
                key={C}
                type="monotone"
                dataKey={`y_C_${C.toExponential(0)}`}
                stroke={`hsl(${120 + i * 30}, 70%, 50%)`}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={`C = ${C.toExponential(0)} FLOPs`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>The Chinchilla scaling law: L(N,D) = L₀ + (Nᶜ/N)^αₙ + (Dᶜ/D)^αᴅ</p>
          <p>Compute constraint: C = 6ND (6 FLOPs per token per parameter)</p>
          <p>Compute-optimal: αₙ(Nᶜ/N)^αₙ = αᴅ(Dᶜ/D)^αᴅ (equal contribution from N and D terms)</p>
        </div>
      </Card>
    </div>
  )
}