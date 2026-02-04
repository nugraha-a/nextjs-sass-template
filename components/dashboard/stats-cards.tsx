"use client"

import React from "react"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

const sparklineData = [
  { value: 100 },
  { value: 120 },
  { value: 115 },
  { value: 145 },
  { value: 130 },
  { value: 160 },
  { value: 175 },
]

const sparklineDataDown = [
  { value: 175 },
  { value: 160 },
  { value: 165 },
  { value: 140 },
  { value: 150 },
  { value: 130 },
  { value: 115 },
]

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
  sparklineData: { value: number }[]
}

function StatCard({ title, value, change, trend, icon: Icon, sparklineData }: StatCardProps) {
  return (
    <Card className="border border-zinc-800/50 bg-zinc-900/50 hover:bg-zinc-900 transition-colors duration-150">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-zinc-500">{title}</span>
          <div className="flex size-7 items-center justify-center rounded-md bg-zinc-800/50">
            <Icon className="size-3.5 text-zinc-500" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-2xl font-semibold tracking-tight text-zinc-100">
              {value}
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend === "up" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {change}
              <span className="text-zinc-600 ml-1">vs last month</span>
            </div>
          </div>
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={trend === "up" ? "#34d399" : "#f87171"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={trend === "up" ? "#34d399" : "#f87171"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={trend === "up" ? "#34d399" : "#f87171"}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const stats: StatCardProps[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    sparklineData: sparklineData,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+15.2%",
    trend: "up",
    icon: Users,
    sparklineData: sparklineData,
  },
  {
    title: "Total Orders",
    value: "12,234",
    change: "-3.2%",
    trend: "down",
    icon: ShoppingCart,
    sparklineData: sparklineDataDown,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+7.4%",
    trend: "up",
    icon: Activity,
    sparklineData: sparklineData,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
