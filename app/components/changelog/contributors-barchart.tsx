"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
  { user: "john", contributions: 275, edit: 145, add: 71, upvote: 26, downvote: 19, comment: 10, close: 4 },
  { user: "jill", contributions: 200, edit: 91, add: 46, upvote: 33, downvote: 12, comment: 13, close: 5 },
  { user: "jack", contributions: 187, edit: 85, add: 28, upvote: 28, downvote: 17, comment: 32, close: 10 },
  { user: "jane", contributions: 173, edit: 92, add: 34, upvote: 15, downvote: 17, comment: 14, close: 1 },
  { user: "jeff", contributions: 90, edit: 55, add: 16, upvote: 6, downvote: 4, comment: 8, close: 1 },
  { user: "jason", contributions: 56, edit: 36, add: 11, upvote: 4, downvote: 1, comment: 4, close: 0 },
]

const chartConfig = {
  contributions: {
    label: "Contributions",
  },
  john: {
    label: "John",
    color: "hsl(var(--chart-1))",
  },
  jill: {
    label: "Jill",
    color: "hsl(var(--chart-2))",
  },
  jack: {
    label: "Jack",
    color: "hsl(var(--chart-3))",
  },
  jane: {
    label: "Jane",
    color: "hsl(var(--chart-4))",
  },
  jeff: {
    label: "Jeff",
    color: "hsl(var(--chart-5))",
  },
  jason: {
    label: "Jason",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ContributorsBarchart() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
        <CardDescription>Over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="user"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="contributions" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="edit" stackId="a" layout="vertical" fill={"#155e75"}/>
            <Bar dataKey="add" stackId="a" layout="vertical" fill={"#0e7490"}/>
            <Bar dataKey="upvote" stackId="a" layout="vertical" fill={"#0891b2"}/>
            <Bar dataKey="downvote" stackId="a" layout="vertical" fill={"#06b6d4"}/>
            <Bar dataKey="comment" stackId="a" layout="vertical" fill={"#22d3ee"}/>
            <Bar dataKey="close" stackId="a" layout="vertical" fill={"#67e8f9"}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
