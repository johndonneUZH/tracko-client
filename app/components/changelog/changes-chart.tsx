/*eslint-disable */

"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react"
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
import { ApiService } from "@/api/apiService"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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

interface ContributionData {
  date: string
  edit: number
  add: number
  upvote: number
  downvote: number
  comment: number
  close: number
}

export function ChangesChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [projectId, setProjectId] = useState<string | null>(null)
  const apiService = new ApiService()
  const router = useRouter()

  useEffect(() => {
    const storedProjectId = sessionStorage.getItem("projectId")
    if (!storedProjectId) {
      toast.error("Project ID not found in session storage")
      router.push("/login")
    } else {
      setProjectId(storedProjectId)
    }
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return // Don't fetch until projectId is set
      
      try {
        const response = await apiService.get<any>(`/projects/${projectId}/changes/analytics`)
        console.log("DATA", response)
        
        // Check if response is an object and convert to array if needed
        let dataArray = Array.isArray(response) ? response : Object.entries(response).map(([date, values]) => ({
          date,
          ...(values as object)
        }))
        
        // Transform API data to match chart format
        const transformedData = dataArray.map((item: any) => ({
          date: item.date,
          edit: item.editIdea || item.edit || 0,
          add: item.addIdea || item.add || 0,
          upvote: item.upvote || 0,
          downvote: item.downvote || 0,
          comment: item.addComment || item.comment || 0,
          close: item.closeIdea || item.close || 0
        }))
        
        setChartData(transformedData)
        console.log("Transformed Chart Data:", transformedData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

  }, [projectId])

  if (loading) {
    return <div>Loading chart data...</div>
  }

  return (
    <>
      {chartData.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
          Go work on the project! No contributions yet.
        </div>
      ) : (
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
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
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
                        });
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
      )}
    </>
  );
}  