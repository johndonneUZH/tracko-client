/* eslint-disable */
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/commons/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/user_page/select"
import { ApiService } from "@/api/apiService"
import { Project } from "@/types/project"
import { useEffect, useState } from "react"

type Contribution = {
  date: string;
  [projectName: string]: number | string;
};

export function ContributionsChart() {
  const [chartData, setChartData] = useState<Contribution[]>([]);
  const [timeRange, setTimeRange] = useState("90d");
  const [projectNames, setProjectNames] = useState<string[]>([]);

  function getBlueShade(index: number, total: number): string {
    const minL = 30;
    const maxL = 80;
    const step = (maxL - minL) / Math.max(total - 1, 1);
    const lightness = maxL - step * index;
    return `hsl(187, 92.4%, ${lightness}%)`;
  }
  
  useEffect(() => {
    async function fetchData() {
      const apiService = new ApiService();
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;
      console.log("ContributionsChart rendered");
      const projects = await apiService.getProjects(userId) as Project[];
      console.log("Projects fetched:", projects);
      const last30Days = Array.from({ length: 90 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (89 - i));
        return d.toISOString().split("T")[0];
      });

      const dataMap: Record<string, Record<string, number>> = {};
      for (const date of last30Days) dataMap[date] = {};

      await Promise.all(
        projects.map(async (project) => {
          console.log("Fetching for project:", project.projectName);
          const contributions = await apiService.getDailyContributions(project.projectId);
          console.log("Contributions:", contributions);
          for (const entry of contributions) {
            if (dataMap[entry.date]) {
              dataMap[entry.date][project.projectName] = entry.count;
            }
          }
        })
      );

      // fill empty slots with 0
      for (const date of last30Days) {
        for (const project of projects) {
          if (!dataMap[date][project.projectName]) {
            dataMap[date][project.projectName] = 0;
          }
        }
      }

      setProjectNames(projects.map(p => p.projectName));
      setChartData(last30Days.map(date => ({
        date,
        ...dataMap[date],
      })));
    }

    fetchData();
  }, []);

  const referenceDate = new Date();
  const daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const chartConfig = Object.fromEntries(projectNames.map((name, i) => [
    name,
    {
      label: name,
      color: getBlueShade(i, projectNames.length),
    }
  ]));
  
  return (
    <Card className="p-0 m-0">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center text-left">
          <CardTitle>Contributions</CardTitle>
          <CardDescription>
            Showing total contributions for the selected range across projects
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
            {projectNames.map((name, i) => {
              const color = getBlueShade(i, projectNames.length);
              return (
              <linearGradient key={name} id={`fill-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
              );
            })}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {projectNames.map((name, i) => (
              <Area
                key={name}
                dataKey={name}
                type="monotone"
                fill={`url(#fill-${i})`}
                stroke={getBlueShade(i, projectNames.length)}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}