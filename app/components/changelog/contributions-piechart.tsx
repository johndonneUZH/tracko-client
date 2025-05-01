/*eslint-disable */

"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/commons/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/commons/chart";
import { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService";
import { Change } from "@/types/change";
import { Project } from "@/types/project";
import { User } from "@/types/user";

interface ContributionData {
  date: string;
  edit: number;
  add: number;
  upvote: number;
  downvote: number;
  comment: number;
  close: number;
}

const chartConfig = {
  count: {
    label: "Count",
  },
  edit: {
    label: "Edit",
    color: "hsl(var(--chart-1))",
  },
  add: {
    label: "Add",
    color: "hsl(var(--chart-2))",
  },
  upvote: {
    label: "Upvote",
    color: "hsl(var(--chart-3))",
  },
  downvote: {
    label: "Downvote",
    color: "hsl(var(--chart-4))",
  },
  comment: {
    label: "Comment",
    color: "hsl(var(--chart-5))",
  },
  close: {
    label: "Close",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function ContributionsPiechart() {
  const [chartData, setChartData] = useState<
    { type: string; count: number; fill: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const apiService = new ApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = sessionStorage.getItem("projectId");
        if (!projectId) throw new Error("Project ID not found in session storage");

        const project = await apiService.get<Project>(`/projects/${projectId}`);
        const projectOwner = await apiService.getUser(project.ownerId) as User;
        const projectMembers = [...project.projectMembers, projectOwner.id];

        const analyticsPromises = projectMembers.map(async (memberId) => {
          const user = await apiService.get<User>(`/users/${memberId}`);
          const analyticsData = await apiService.get<any[]>(`/projects/${projectId}/changes/analytics/${memberId}`);

          const totals = analyticsData.reduce((acc: any, entry: any) => ({
            add: (acc.add || 0) + (entry.addIdea || 0),
            edit: (acc.edit || 0) + (entry.editIdea || 0),
            close: (acc.close || 0) + (entry.closeIdea || 0),
            comment: (acc.comment || 0) + (entry.addComment || 0),
            upvote: (acc.upvote || 0) + (entry.upvote || 0),
            downvote: (acc.downvote || 0) + (entry.downvote || 0),
          }), {});

          const contributions = (Object.values(totals) as number[]).reduce((sum, val) => sum + val, 0)
          return {
            user: memberId,
            username: user.username,
            contributions,
            ...totals,
          };
        });

        const usersAnalytics = await Promise.all(analyticsPromises);

        const totalAnalytics = usersAnalytics.reduce(
          (acc, user) => ({
            edit: acc.edit + (user.edit || 0),
            add: acc.add + (user.add || 0),
            upvote: acc.upvote + (user.upvote || 0),
            downvote: acc.downvote + (user.downvote || 0),
            comment: acc.comment + (user.comment || 0),
            close: acc.close + (user.close || 0),
          }),
          { edit: 0, add: 0, upvote: 0, downvote: 0, comment: 0, close: 0 }
        );

        const transformedData = [
          { type: "edit", count: totalAnalytics.edit, fill: "#155e75" },
          { type: "add", count: totalAnalytics.add, fill: "#0e7490" },
          { type: "upvote", count: totalAnalytics.upvote, fill: "#0891b2" },
          { type: "downvote", count: totalAnalytics.downvote, fill: "#06b6d4" },
          { type: "comment", count: totalAnalytics.comment, fill: "#22d3ee" },
          { type: "close", count: totalAnalytics.close, fill: "#67e8f9" },
        ];
        setChartData(transformedData);
      } catch (error) {
        console.error("Error fetching contributors data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col shadow-none border-none">
      {loading ? (
        <CardContent className="flex-1 pb-0">Loading...</CardContent>
      ) : chartData.length === 0 ? (
        <CardContent className="flex-1 pb-0">No data available</CardContent>
      ) : (
        <>
          <CardHeader className="items-center pb-0">
            <CardTitle>Types of Contributions</CardTitle>
            <CardDescription>Over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="aspect-square h-full">
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
        </>
      )}
    </Card>
  )
}  