"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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
  { type: "edit", count: 275, fill: "#155e75" },
  { type: "add", count: 200, fill: "#0e7490" },
  { type: "upvote", count: 187, fill: "#0891b2" },
  { type: "downvote", count: 173, fill: "#06b6d4" },
  { type: "comment", count: 90, fill: "#22d3ee" },
  { type: "close", count: 56, fill: "#67e8f9" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
  edit: {
    label: "edit",
    color: "hsl(var(--chart-1))",
  },
  add: {
    label: "add",
    color: "hsl(var(--chart-2))",
  },
  upvote: {
    label: "upvote",
    color: "hsl(var(--chart-3))",
  },
  downvote: {
    label: "downvote",
    color: "hsl(var(--chart-4))",
  },
  comment: {
    label: "comment",
    color: "hsl(var(--chart-5))",
  },
  closet: {
    label: "close",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ContributionsPiechart() {
  return (
    <Card className="flex flex-col shadow-none border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Types of Contributions</CardTitle>
        <CardDescription>Over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
