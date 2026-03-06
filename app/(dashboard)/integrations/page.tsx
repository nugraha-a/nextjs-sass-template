import { Puzzle, Search, Plus, Zap, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const integrations = [
    { name: "Slack", description: "Team messaging and notifications", status: "connected", category: "Communication" },
    { name: "Google Workspace", description: "Email, calendar, and drive sync", status: "connected", category: "Productivity" },
    { name: "Jira", description: "Project and issue tracking", status: "pending", category: "Project Management" },
    { name: "GitHub", description: "Code repository and CI/CD", status: "disconnected", category: "Development" },
    { name: "Stripe", description: "Payment processing and billing", status: "connected", category: "Finance" },
    { name: "Salesforce", description: "CRM and sales pipeline", status: "disconnected", category: "Sales" },
]

export default function IntegrationsPage() {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
                    <p className="text-sm text-muted-foreground">Connect your tools and services</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input placeholder="Search integrations..." className="h-9 w-64 pl-8 text-sm" />
                    </div>
                    <Button size="sm" className="h-9">
                        <Plus className="size-3.5 mr-1.5" />Add New
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">3</p>
                            <p className="text-xs text-muted-foreground">Connected</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-amber-500/10 text-amber-500">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">1</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                            <Puzzle className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">6</p>
                            <p className="text-xs text-muted-foreground">Available</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">All Integrations</CardTitle>
                    <CardDescription className="text-xs">Manage your connected services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {integrations.map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-md bg-primary/10 text-primary">
                                    <Zap className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className={`text-[10px] ${item.status === "connected" ? "bg-emerald-500/10 text-emerald-400" :
                                        item.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                                            "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {item.status}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
