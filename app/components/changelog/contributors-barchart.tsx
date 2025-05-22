/*eslint-disable */

"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ApiService } from "@/api/apiService"

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
import { Project, ProjectMember } from "@/types/project"
import { User } from "@/types/user"

interface UserAnalytics {
  user: string
  username: string
  contributions: number
  edit: number
  add: number
  upvote: number
  downvote: number
  comment: number
  close: number
}

export function ContributorsBarchart() {
  const [chartData, setChartData] = useState<UserAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [chartConfig, setChartConfig] = useState<Record<string, any>>({
    contributions: {
      label: "Contributions",
    }
  })
  const apiService = new ApiService()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get projectId from session storage
        const projectId = sessionStorage.getItem("projectId")
        if (!projectId) throw new Error("Project ID not found in session storage")

        // Fetch project data to get members
        const project = await apiService.get<Project>(`/projects/${projectId}`)
        console.log("Project data:", project)
        const projectOwner = await apiService.getUser(project.ownerId) as User
        const projectMembers = project.projectMembers
        projectMembers.push(projectOwner.id)

        // Fetch all users data and their analytics
        const analyticsPromises = projectMembers.map(async (member) => {
          const userId = member // or member.id depending on your model
          const user = await apiService.get<User>(`/users/${userId}`)
          const analyticsData = await apiService.get<any[]>(`/projects/${projectId}/changes/analytics/${userId}`)
          
          const totals = analyticsData.reduce((acc: any, entry: any) => ({
            add: (acc.add || 0) + (entry.addIdea || 0),
            edit: (acc.edit || 0) + (entry.editIdea || 0),
            close: (acc.close || 0) + (entry.closeIdea || 0),
            comment: (acc.comment || 0) + (entry.addComment || 0),
            vote: (acc.upvote || 0) + (entry.upvote || 0) + (acc.downvote || 0) + (entry.downvote || 0),
            downvote: (acc.downvote || 0) + (entry.downvote || 0)
          }), {})
        
          const contributions = Object.values(totals as Record<string, number>).reduce((sum, val) => sum + val, 0)
        
          return {
            user: userId,
            username: user.username,
            contributions,
            ...totals
          }
        })
        

        const usersAnalytics = await Promise.all(analyticsPromises)
        
        // Sort by contributions descending
        const sortedData = usersAnalytics.sort((a, b) => b.contributions - a.contributions)
        
        setChartData(sortedData)
        
        // Generate dynamic chart config based on users
        const newChartConfig = {
          contributions: { label: "Contributions" },
          ...sortedData.reduce((acc, user, index) => ({
            ...acc,
            [user.user]: {
              label: user.username,
              color: `hsl(var(--chart-${index % 5 + 1}))`
            }
          }), {})
        }
        
        setChartConfig(newChartConfig)
      } catch (error) {
        console.error("Error fetching contributors data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>No contributor data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

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
              top: 0,
              right: 0,
              bottom: 0,
              left: 25, // Increased from 0 to 120 to give room for usernames
            }}
          >
            <YAxis
              dataKey="user"
              type="category"
              tickLine={false}
              tickMargin={12} // Optional, adds space between tick and axis
              axisLine={false}
              width={80} // Ensures enough width for long usernames
              tickFormatter={(value) =>
                chartConfig[value]?.label || value
              }
            />

            <XAxis dataKey="contributions" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="edit" stackId="a" layout="vertical" fill={"#155e75"}/>
            <Bar dataKey="add" stackId="a" layout="vertical" fill={"#0e7490"}/>
            <Bar dataKey="vote" stackId="a" layout="vertical" fill={"#0891b2"}/>
            <Bar dataKey="comment" stackId="a" layout="vertical" fill={"#22d3ee"}/>
            <Bar dataKey="close" stackId="a" layout="vertical" fill={"#67e8f9"}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}