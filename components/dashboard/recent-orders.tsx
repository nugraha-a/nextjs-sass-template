"use client"

import { useState } from "react"
import { Search, Filter, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const orders = [
  {
    id: "ORD-001",
    customer: "Olivia Martin",
    email: "olivia@email.com",
    amount: "$1,999.00",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jackson Lee",
    email: "jackson@email.com",
    amount: "$39.00",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Isabella Nguyen",
    email: "isabella@email.com",
    amount: "$299.00",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "William Kim",
    email: "william@email.com",
    amount: "$99.00",
    status: "failed",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Sofia Davis",
    email: "sofia@email.com",
    amount: "$149.00",
    status: "processing",
    date: "2024-01-13",
  },
]

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
}

export function RecentOrders() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="border border-zinc-800/50 bg-zinc-900/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-medium tracking-tight text-zinc-100">
              Recent Orders
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              {filteredOrders.length} orders found
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150"
          >
            View all
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-colors duration-150"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-28 h-8 text-xs border-zinc-800 bg-zinc-900 text-zinc-400 focus:ring-zinc-700">
              <Filter className="mr-1.5 size-3 text-zinc-600" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">All Status</SelectItem>
              <SelectItem value="completed" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">Completed</SelectItem>
              <SelectItem value="pending" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">Pending</SelectItem>
              <SelectItem value="processing" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">Processing</SelectItem>
              <SelectItem value="failed" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800/50 hover:bg-transparent">
              <TableHead className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider h-8">
                Order
              </TableHead>
              <TableHead className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider h-8">
                Customer
              </TableHead>
              <TableHead className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider h-8">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider text-right h-8">
                Amount
              </TableHead>
              <TableHead className="w-8 h-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className="border-zinc-800/50 hover:bg-zinc-800/30 transition-colors duration-150"
              >
                <TableCell className="font-mono text-xs text-zinc-300 py-2.5">
                  {order.id}
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-100">
                      {order.customer}
                    </span>
                    <span className="text-[11px] text-zinc-600">
                      {order.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <Badge
                    variant="outline"
                    className={`capitalize font-medium text-[10px] px-1.5 py-0 ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-medium text-zinc-100 py-2.5">
                  {order.amount}
                </TableCell>
                <TableCell className="py-2.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-zinc-600 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150"
                      >
                        <MoreHorizontal className="size-3.5" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">View details</DropdownMenuItem>
                      <DropdownMenuItem className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">Edit order</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400 text-xs">
                        Cancel order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
