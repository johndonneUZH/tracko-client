"use client"

import { TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/commons/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/commons/chart"
const chartData = [
  { month: "January", desktop: 65, mobile: 97 },
  { month: "February", desktop: 52, mobile: 105 },
  { month: "March", desktop: 41, mobile: 82 },
  { month: "April", desktop: 44, mobile: 89 },
  { month: "May", desktop: 36, mobile: 112 },
  { month: "June", desktop: 31, mobile: 102 },
]

const chartConfig = {
  mobile: {
    label: "no Tracko",
    color: "hsl(var(--chart-2))",
  },
  desktop: {
    label: "Tracko",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Linechart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Time spent in Meetings</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="#0e7490"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="#0891b2"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending down by 65.1% overall <TrendingDown className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Comparing teams working with and without Tracko over the past 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
