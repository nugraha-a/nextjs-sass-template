"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { month: "Jan", revenue: 18600, orders: 4200 },
  { month: "Feb", revenue: 30500, orders: 5800 },
  { month: "Mar", revenue: 23700, orders: 4900 },
  { month: "Apr", revenue: 27300, orders: 5300 },
  { month: "May", revenue: 20900, orders: 4600 },
  { month: "Jun", revenue: 31400, orders: 6100 },
  { month: "Jul", revenue: 34700, orders: 6800 },
  { month: "Aug", revenue: 29100, orders: 5700 },
  { month: "Sep", revenue: 38500, orders: 7200 },
  { month: "Oct", revenue: 42800, orders: 8100 },
  { month: "Nov", revenue: 35900, orders: 6900 },
  { month: "Dec", revenue: 45200, orders: 8500 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#fafafa",
  },
  orders: {
    label: "Orders",
    color: "#52525b",
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card className="border border-zinc-800/50 bg-zinc-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium tracking-tight text-zinc-100">
            Revenue Analytics
          </CardTitle>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monthly revenue and order trends
          </p>
        </div>
        <Select defaultValue="year">
          <SelectTrigger className="w-28 h-8 text-xs border-zinc-800 bg-zinc-900 text-zinc-400 focus:ring-zinc-700">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="week" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">This Week</SelectItem>
            <SelectItem value="month" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">This Month</SelectItem>
            <SelectItem value="quarter" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">This Quarter</SelectItem>
            <SelectItem value="year" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fafafa" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#fafafa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52525b" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#52525b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              dx={-5}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="bg-zinc-900 border-zinc-800"
                  formatter={(value, name) => (
                    <span className="font-mono text-zinc-100">
                      {name === "revenue" ? `$${value.toLocaleString()}` : value.toLocaleString()}
                    </span>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#fafafa"
              strokeWidth={1.5}
              fill="url(#revenueGradient)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#52525b"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="url(#ordersGradient)"
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-3 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-zinc-100" />
            <span className="text-zinc-500">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-zinc-600" />
            <span className="text-zinc-500">Orders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
