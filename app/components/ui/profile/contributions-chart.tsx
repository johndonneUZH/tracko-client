"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const chartData = [
  {"date": "2024-04-01", "desktop": 6, "mobile": 0},
  {"date": "2024-04-02", "desktop": 3, "mobile": 2},
  {"date": "2024-04-03", "desktop": 7, "mobile": 1},
  {"date": "2024-04-04", "desktop": 13, "mobile": 0},
  {"date": "2024-04-05", "desktop": 2, "mobile": 5},
  {"date": "2024-04-06", "desktop": 2, "mobile": 5},
  {"date": "2024-04-07", "desktop": 13, "mobile": 4},
  {"date": "2024-04-08", "desktop": 8, "mobile": 2},
  {"date": "2024-04-09", "desktop": 1, "mobile": 0},
  {"date": "2024-04-10", "desktop": 7, "mobile": 1},
  {"date": "2024-04-11", "desktop": 1, "mobile": 1},
  {"date": "2024-04-12", "desktop": 1, "mobile": 0},
  {"date": "2024-04-13", "desktop": 5, "mobile": 3},
  {"date": "2024-04-14", "desktop": 0, "mobile": 6},
  {"date": "2024-04-15", "desktop": 0, "mobile": 15},
  {"date": "2024-04-16", "desktop": 0, "mobile": 5},
  {"date": "2024-04-17", "desktop": 0, "mobile": 5},
  {"date": "2024-04-18", "desktop": 5, "mobile": 3},
  {"date": "2024-04-19", "desktop": 0, "mobile": 0},
  {"date": "2024-04-20", "desktop": 0, "mobile": 3},
  {"date": "2024-04-21", "desktop": 12, "mobile": 4},
  {"date": "2024-04-22", "desktop": 2, "mobile": 18},
  {"date": "2024-04-23", "desktop": 4, "mobile": 2},
  {"date": "2024-04-24", "desktop": 0, "mobile": 5},
  {"date": "2024-04-25", "desktop": 0, "mobile": 3},
  {"date": "2024-04-26", "desktop": 4, "mobile": 0},
  {"date": "2024-04-27", "desktop": 0, "mobile": 10},
  {"date": "2024-04-28", "desktop": 6, "mobile": 8},
  {"date": "2024-04-29", "desktop": 0, "mobile": 8},
  {"date": "2024-04-30", "desktop": 2, "mobile": 0},
  {"date": "2024-05-01", "desktop": 15, "mobile": 0},
  {"date": "2024-05-02", "desktop": 3, "mobile": 7},
  {"date": "2024-05-03", "desktop": 0, "mobile": 17},
  {"date": "2024-05-04", "desktop": 8, "mobile": 0},
  {"date": "2024-05-05", "desktop": 0, "mobile": 0},
  {"date": "2024-05-06", "desktop": 5, "mobile": 4},
  {"date": "2024-05-07", "desktop": 0, "mobile": 0},
  {"date": "2024-05-08", "desktop": 0, "mobile": 0},
  {"date": "2024-05-09", "desktop": 5, "mobile": 4},
  {"date": "2024-05-10", "desktop": 8, "mobile": 0},
  {"date": "2024-05-11", "desktop": 5, "mobile": 6},
  {"date": "2024-05-12", "desktop": 3, "mobile": 0},
  {"date": "2024-05-13", "desktop": 2, "mobile": 13},
  {"date": "2024-05-14", "desktop": 0, "mobile": 0},
  {"date": "2024-05-15", "desktop": 0, "mobile": 2},
  {"date": "2024-05-16", "desktop": 1, "mobile": 8},
  {"date": "2024-05-17", "desktop": 10, "mobile": 0},
  {"date": "2024-05-18", "desktop": 6, "mobile": 5},
  {"date": "2024-05-19", "desktop": 0, "mobile": 11},
  {"date": "2024-05-20", "desktop": 5, "mobile": 0},
  {"date": "2024-05-21", "desktop": 1, "mobile": 5},
  {"date": "2024-05-22", "desktop": 0, "mobile": 5},
  {"date": "2024-05-23", "desktop": 7, "mobile": 8},
  {"date": "2024-05-24", "desktop": 10, "mobile": 0},
  {"date": "2024-05-25", "desktop": 9, "mobile": 0},
  {"date": "2024-05-26", "desktop": 0, "mobile": 7},
  {"date": "2024-05-27", "desktop": 2, "mobile": 5},
  {"date": "2024-05-28", "desktop": 5, "mobile": 5},
  {"date": "2024-05-29", "desktop": 9, "mobile": 6},
  {"date": "2024-05-30", "desktop": 1, "mobile": 0},
  {"date": "2024-05-31", "desktop": 2, "mobile": 5},
  {"date": "2024-06-01", "desktop": 0, "mobile": 5},
  {"date": "2024-06-02", "desktop": 0, "mobile": 0},
  {"date": "2024-06-03", "desktop": 8, "mobile": 15},
  {"date": "2024-06-04", "desktop": 12, "mobile": 6},
  {"date": "2024-06-05", "desktop": 3, "mobile": 0},
  {"date": "2024-06-06", "desktop": 10, "mobile": 7},
  {"date": "2024-06-07", "desktop": 6, "mobile": 0},
  {"date": "2024-06-08", "desktop": 0, "mobile": 8},
  {"date": "2024-06-09", "desktop": 6, "mobile": 10},
  {"date": "2024-06-10", "desktop": 13, "mobile": 0},
  {"date": "2024-06-11", "desktop": 3, "mobile": 9},
  {"date": "2024-06-12", "desktop": 13, "mobile": 6},
  {"date": "2024-06-13", "desktop": 0, "mobile": 8},
  {"date": "2024-06-14", "desktop": 8, "mobile": 15},
  {"date": "2024-06-15", "desktop": 4, "mobile": 2},
  {"date": "2024-06-16", "desktop": 2, "mobile": 0},
  {"date": "2024-06-17", "desktop": 4, "mobile": 0},
  {"date": "2024-06-18", "desktop": 0, "mobile": 0},
  {"date": "2024-06-19", "desktop": 2, "mobile": 3},
  {"date": "2024-06-20", "desktop": 6, "mobile": 6},
  {"date": "2024-06-21", "desktop": 0, "mobile": 0 },
  {"date": "2024-06-22", "desktop": 13, "mobile": 0 },
  {"date": "2024-06-23", "desktop": 0, "mobile": 2 },
  {"date": "2024-06-24", "desktop": 0, "mobile": 0 },
  {"date": "2024-06-25", "desktop": 0, "mobile": 0 },
  {"date": "2024-06-26", "desktop": 4, "mobile": 1 },
  {"date": "2024-06-27", "desktop": 7, "mobile": 8 },
  {"date": "2024-06-28", "desktop": 3, "mobile": 2 },
  {"date": "2024-06-29", "desktop": 1, "mobile": 11 },
  {"date": "2024-06-30", "desktop": 5, "mobile": 8 }
]

const chartConfig = {
  visitors: {
    label: "Contributions",
  },
  desktop: {
    label: "Tracko",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Apple",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ContributionsChart() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className='border-none'>
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Contributions</CardTitle>
          <CardDescription>
            Showing total contributions for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#22d3ee"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#0e7490"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#38bdf8"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#bae6fd"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="#bae6fd"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="#0e7490"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
