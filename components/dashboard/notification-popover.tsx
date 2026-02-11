"use client"

import * as React from "react"
import { Bell, Check, ChevronRight, Info, AlertTriangle, CheckCircle, Package, FileText, Settings } from "lucide-react"
import Link from "next/link"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "system" | "file"
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New tenant registered",
    description: "PT. Sinar Mas has completed registration.",
    time: "2 min ago",
    read: false,
    type: "info"
  },
  {
    id: "2",
    title: "System Maintenance",
    description: "Scheduled maintenance in 2 hours.",
    time: "1 hour ago",
    read: false,
    type: "warning"
  },
  {
    id: "3",
    title: "Approval Request",
    description: "Leave request from John Doe requires approval.",
    time: "3 hours ago",
    read: true,
    type: "system"
  },
  {
    id: "4",
    title: "Payment Received",
    description: "Invoice #INV-2024-001 has been paid.",
    time: "Yesterday",
    read: true,
    type: "success"
  },
  {
    id: "5",
    title: "New Feature Available",
    description: "Check out the new Workflow Engine updates.",
    time: "2 days ago",
    read: true,
    type: "system"
  },
]

function getIcon(type: NotificationItem["type"]) {
    switch (type) {
        case "info": return <Info className="size-4 text-primary" />
        case "warning": return <AlertTriangle className="size-4 text-amber-500" />
        case "success": return <CheckCircle className="size-4 text-green-500" />
        case "system": return <Settings className="size-4 text-purple-500" />
        case "file": return <FileText className="size-4 text-orange-500" />
        default: return <Bell className="size-4" />
    }
}

export function NotificationPopover() {
  const [open, setOpen] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(2)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 overflow-visible"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <div className="absolute top-0.5 right-0.5 flex size-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-3 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white ring-1 ring-background">
                {unreadCount}
              </span>
            </div>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-xl border-border/50" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:bg-transparent transition-colors"
              onClick={() => setUnreadCount(0)}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[320px] py-2">
          <div className="flex flex-col gap-0.5 px-2">
            {mockNotifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group",
                  "hover:bg-secondary/80",
                  !item.read ? "bg-secondary/30" : "bg-transparent"
                )}
              >
                {/* Icon Box */}
                <div className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40 transition-shadow",
                    "bg-background/50 group-hover:bg-background group-hover:shadow-sm"
                )}>
                   {getIcon(item.type)}
                </div>
                
                <div className="flex flex-col gap-0.5 flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-[13px] font-medium truncate leading-none", !item.read ? "text-foreground font-semibold" : "text-muted-foreground")}>
                            {item.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-tight">
                        {item.description}
                    </p>
                </div>
                {!item.read && (
                    <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-border/50 p-2 bg-muted/20">
             <Button variant="ghost" className="w-full h-8 text-xs justify-center text-primary hover:text-primary/80 hover:bg-secondary/50 transition-colors rounded-md" onClick={() => setOpen(false)} asChild>
               <Link href="/notifications">
                 View all notifications <ChevronRight className="ml-1 size-3" />
               </Link>
             </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
