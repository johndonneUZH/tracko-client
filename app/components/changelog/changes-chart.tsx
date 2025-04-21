"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
    { date: "2024-04-01", edit: 16, close: 2, comment: 3, upvote: 8, downvote: 4, add: 8 },
    { date: "2024-04-02", edit: 11, close: 0, comment: 7, upvote: 5, downvote: 3, add: 3 },
    { date: "2024-04-03", edit: 17, close: 1, comment: 5, upvote: 9, downvote: 3, add: 2 },
    { date: "2024-04-04", edit: 24, close: 1, comment: 8, upvote: 9, downvote: 3, add: 1 },
    { date: "2024-04-05", edit: 10, close: 0, comment: 7, upvote: 6, downvote: 3, add: 11 },
    { date: "2024-04-06", edit: 7, close: 2, comment: 3, upvote: 9, downvote: 2, add: 0 },
    { date: "2024-04-07", edit: 9, close: 1, comment: 7, upvote: 10, downvote: 2, add: 2 },
    { date: "2024-04-08", edit: 19, close: 1, comment: 9, upvote: 6, downvote: 3, add: 4 },
    { date: "2024-04-09", edit: 13, close: 2, comment: 5, upvote: 7, downvote: 3, add: 12 },
    { date: "2024-04-10", edit: 22, close: 1, comment: 3, upvote: 5, downvote: 2, add: 5 },
    { date: "2024-04-11", edit: 12, close: 2, comment: 6, upvote: 9, downvote: 3, add: 7 },
    { date: "2024-04-12", edit: 11, close: 1, comment: 7, upvote: 8, downvote: 2, add: 5 },
    { date: "2024-04-13", edit: 19, close: 0, comment: 8, upvote: 7, downvote: 3, add: 5 },
    { date: "2024-04-14", edit: 16, close: 1, comment: 4, upvote: 6, downvote: 3, add: 5 },
    { date: "2024-04-15", edit: 12, close: 0, comment: 5, upvote: 7, downvote: 3, add: 4 },
    { date: "2024-04-16", edit: 8, close: 1, comment: 3, upvote: 10, downvote: 2, add: 2 },
    { date: "2024-04-17", edit: 11, close: 2, comment: 6, upvote: 9, downvote: 3, add: 1 },
    { date: "2024-04-18", edit: 19, close: 1, comment: 4, upvote: 8, downvote: 3, add: 5 },
    { date: "2024-04-19", edit: 21, close: 0, comment: 6, upvote: 7, downvote: 0, add: 3 },
    { date: "2024-04-20", edit: 15, close: 1, comment: 5, upvote: 6, downvote: 3, add: 4 },
    { date: "2024-04-21", edit: 11, close: 0, comment: 6, upvote: 8, downvote: 3, add: 5 },
    { date: "2024-04-22", edit: 3, close: 2, comment: 5, upvote: 9, downvote: 3, add: 2 },
    { date: "2024-04-23", edit: 12, close: 1, comment: 7, upvote: 9, downvote: 3, add: 6 },
    { date: "2024-04-24", edit: 16, close: 0, comment: 8, upvote: 8, downvote: 3, add: 5 },
    { date: "2024-04-25", edit: 8, close: 1, comment: 4, upvote: 7, downvote: 3, add: 6 },
    { date: "2024-04-26", edit: 11, close: 1, comment: 5, upvote: 9, downvote: 2, add: 4 },
    { date: "2024-04-27", edit: 14, close: 2, comment: 6, upvote: 8, downvote: 3, add: 3 },
    { date: "2024-04-28", edit: 13, close: 0, comment: 4, upvote: 7, downvote: 3, add: 5 },
    { date: "2024-04-29", edit: 16, close: 2, comment: 7, upvote: 9, downvote: 3, add: 9 },
    { date: "2024-04-30", edit: 15, close: 0, comment: 6, upvote: 8, downvote: 3, add: 11 },
    { date: "2024-05-01", edit: 17, close: 1, comment: 5, upvote: 10, downvote: 3, add: 4 },
    { date: "2024-05-02", edit: 12, close: 2, comment: 3, upvote: 7, downvote: 3, add: 2 },
    { date: "2024-05-03", edit: 16, close: 1, comment: 6, upvote: 9, downvote: 3, add: 3 },
    { date: "2024-05-04", edit: 21, close: 1, comment: 4, upvote: 10, downvote: 3, add: 6 },
    { date: "2024-05-05", edit: 19, close: 2, comment: 7, upvote: 8, downvote: 3, add: 5 },
    { date: "2024-05-06", edit: 14, close: 0, comment: 6, upvote: 8, downvote: 2, add: 4 },
    { date: "2024-05-07", edit: 9, close: 1, comment: 5, upvote: 7, downvote: 3, add: 1 },
    { date: "2024-05-08", edit: 14, close: 2, comment: 4, upvote: 8, downvote: 3, add: 0 },
    { date: "2024-05-09", edit: 11, close: 1, comment: 3, upvote: 9, downvote: 2, add: 2 },
    { date: "2024-05-10", edit: 18, close: 0, comment: 7, upvote: 6, downvote: 3, add: 7 },
    { date: "2024-05-11", edit: 21, close: 1, comment: 5, upvote: 9, downvote: 2, add: 6 },
    { date: "2024-05-12", edit: 15, close: 2, comment: 6, upvote: 8, downvote: 3, add: 4 },
    { date: "2024-05-13", edit: 14, close: 1, comment: 3, upvote: 9, downvote: 3, add: 3 },
    { date: "2024-05-14", edit: 21, close: 2, comment: 7, upvote: 8, downvote: 3, add: 6 },
    { date: "2024-05-15", edit: 17, close: 0, comment: 4, upvote: 7, downvote: 3, add: 8 },
    { date: "2024-05-16", edit: 12, close: 2, comment: 5, upvote: 9, downvote: 3, add: 3 },
    { date: "2024-05-17", edit: 16, close: 1, comment: 6, upvote: 8, downvote: 3, add: 4 },
    { date: "2024-05-18", edit: 15, close: 0, comment: 7, upvote: 6, downvote: 3, add: 7 },
    { date: "2024-05-19", edit: 13, close: 1, comment: 5, upvote: 9, downvote: 2, add: 6 },
    { date: "2024-05-20", edit: 18, close: 0, comment: 4, upvote: 7, downvote: 3, add: 5 },
    { date: "2024-05-21", edit: 14, close: 2, comment: 3, upvote: 8, downvote: 3, add: 4 },
    { date: "2024-05-22", edit: 18, close: 1, comment: 4, upvote: 6, downvote: 3, add: 2 },
    { date: "2024-05-23", edit: 13, close: 0, comment: 6, upvote: 9, downvote: 3, add: 1 },
    { date: "2024-05-24", edit: 12, close: 2, comment: 5, upvote: 7, downvote: 3, add: 4 },
    { date: "2024-05-25", edit: 14, close: 1, comment: 4, upvote: 8, downvote: 2, add: 2 },
    { date: "2024-05-26", edit: 19, close: 0, comment: 7, upvote: 8, downvote: 3, add: 5 },
    { date: "2024-05-27", edit: 18, close: 1, comment: 8, upvote: 9, downvote: 3, add: 14 },
    { date: "2024-05-28", edit: 14, close: 2, comment: 5, upvote: 8, downvote: 2, add: 11 },
    { date: "2024-05-29", edit: 16, close: 1, comment: 4, upvote: 9, downvote: 3, add: 9 },
    { date: "2024-05-30", edit: 12, close: 0, comment: 6, upvote: 8, downvote: 3, add: 6 },
    { date: "2024-05-31", edit: 11, close: 2, comment: 5, upvote: 7, downvote: 3, add: 8 },
    { date: "2024-06-01", edit: 14, close: 1, comment: 4, upvote: 8, downvote: 3, add: 2 },
    { date: "2024-06-02", edit: 19, close: 0, comment: 7, upvote: 6, downvote: 3, add: 4 },
    { date: "2024-06-03", edit: 11, close: 2, comment: 3, upvote: 9, downvote: 2, add: 9 },
    { date: "2024-06-04", edit: 14, close: 1, comment: 5, upvote: 8, downvote: 3, add: 3 },
    { date: "2024-06-05", edit: 17, close: 0, comment: 4, upvote: 9, downvote: 2, add: 2 },
    { date: "2024-06-06", edit: 11, close: 1, comment: 3, upvote: 8, downvote: 3, add: 0 },
    { date: "2024-06-07", edit: 18, close: 0, comment: 6, upvote: 9, downvote: 3, add: 4 },
    { date: "2024-06-08", edit: 15, close: 1, comment: 5, upvote: 9, downvote: 3, add: 5 },
    { date: "2024-06-09", edit: 12, close: 2, comment: 4, upvote: 10, downvote: 3, add: 6 },
    { date: "2024-06-10", edit: 10, close: 1, comment: 3, upvote: 7, downvote: 3, add: 9 },
    { date: "2024-06-11", edit: 14, close: 0, comment: 4, upvote: 9, downvote: 2, add: 3 },
    { date: "2024-06-12", edit: 21, close: 1, comment: 5, upvote: 8, downvote: 3, add: 4 },
    { date: "2024-06-13", edit: 18, close: 0, comment: 7, upvote: 9, downvote: 3, add: 6 },
    { date: "2024-06-14", edit: 14, close: 1, comment: 5, upvote: 10, downvote: 3, add: 7 },
    { date: "2024-06-15", edit: 17, close: 1, comment: 6, upvote: 8, downvote: 3, add: 5 },
    { date: "2024-06-16", edit: 15, close: 0, comment: 4, upvote: 7, downvote: 3, add: 5 },
    { date: "2024-06-17", edit: 22, close: 2, comment: 7, upvote: 9, downvote: 3, add: 4 },
    { date: "2024-06-18", edit: 12, close: 1, comment: 6, upvote: 9, downvote: 3, add: 4 },
    { date: "2024-06-19", edit: 17, close: 0, comment: 4, upvote: 8, downvote: 2, add: 3 },
    { date: "2024-06-20", edit: 13, close: 2, comment: 5, upvote: 10, downvote: 3, add: 4 },
    { date: "2024-06-21", edit: 11, close: 1, comment: 4, upvote: 8, downvote: 3, add: 2 },
    { date: "2024-06-22", edit: 1, close: 0, comment: 6, upvote: 7, downvote: 3, add: 1 },
    { date: "2024-06-23", edit: 17, close: 2, comment: 7, upvote: 0, downvote: 3, add: 8 },
    { date: "2024-06-24", edit: 14, close: 1, comment: 4, upvote: 9, downvote: 3, add: 3 },
    { date: "2024-06-25", edit: 15, close: 2, comment: 6, upvote: 8, downvote: 2, add: 5 },
    { date: "2024-06-26", edit: 18, close: 0, comment: 5, upvote: 7, downvote: 3, add: 4 },
    { date: "2024-06-27", edit: 21, close: 1, comment: 4, upvote: 9, downvote: 3, add: 4 },
    { date: "2024-06-28", edit: 14, close: 2, comment: 7, upvote: 8, downvote: 3, add: 6 },
    { date: "2024-06-29", edit: 18, close: 0, comment: 6, upvote: 9, downvote: 2, add: 7 },
    { date: "2024-06-30", edit: 20, close: 1, comment: 5, upvote: 8, downvote: 3, add: 5 },
  ]
  

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChangesChart() {

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Contributions</CardTitle>
          <CardDescription>
            Showing total contributions across all action types over the past 3 months.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="edit" stackId="a" fill={"#155e75"} />
            <Bar dataKey="add" stackId="a" fill={"#0e7490"} />
            <Bar dataKey="upvote" stackId="a" fill={"#0891b2"} />
            <Bar dataKey="downvote" stackId="a" fill={"#06b6d4"} />
            <Bar dataKey="comment" stackId="a" fill={"#22d3ee"} />
            <Bar dataKey="close" stackId="a" fill={"#67e8f9"} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
