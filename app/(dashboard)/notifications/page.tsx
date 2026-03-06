import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const notifications = [
    { id: 1, title: "New team member added", message: "Sari Dewi joined Acme Corporation workspace", time: "2 hours ago", type: "info", read: false },
    { id: 2, title: "Workflow completed", message: "Purchase Order #PO-2024-089 has been approved", time: "4 hours ago", type: "success", read: false },
    { id: 3, title: "Budget alert", message: "Engineering department has reached 85% of monthly budget", time: "1 day ago", type: "warning", read: true },
    { id: 4, title: "System update", message: "Scheduled maintenance window: March 10, 2024 02:00-04:00 UTC", time: "2 days ago", type: "info", read: true },
    { id: 5, title: "Task assigned", message: "You have been assigned to review Contract #CT-2024-012", time: "3 days ago", type: "info", read: true },
]

function getTypeIcon(type: string) {
    switch (type) {
        case "success": return <CheckCircle2 className="size-4 text-emerald-500" />
        case "warning": return <AlertTriangle className="size-4 text-amber-500" />
        default: return <Info className="size-4 text-primary" />
    }
}

export default function NotificationsPage() {
    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
                    <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                        <Check className="size-3.5 mr-1.5" />Mark all read
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs text-destructive hover:text-destructive">
                        <Trash2 className="size-3.5 mr-1.5" />Clear all
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Bell className="size-4" />
                        Recent
                        {unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-[10px] h-5 px-1.5">{unreadCount}</Badge>
                        )}
                    </CardTitle>
                    <CardDescription className="text-xs">Your latest notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${n.read ? "hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/8"
                                }`}
                        >
                            <div className="mt-0.5">{getTypeIcon(n.type)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm ${n.read ? "text-foreground" : "font-medium text-foreground"}`}>{n.title}</p>
                                    {!n.read && <div className="size-2 rounded-full bg-primary shrink-0" />}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                                <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
