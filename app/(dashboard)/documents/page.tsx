import { FileText, Search, Plus, FolderOpen, Clock, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const recentDocuments = [
    { name: "Q4 Financial Report", type: "PDF", updatedAt: "2 hours ago", size: "2.4 MB", starred: true },
    { name: "Employee Handbook v3", type: "DOCX", updatedAt: "1 day ago", size: "1.8 MB", starred: false },
    { name: "Project Proposal - Phase 2", type: "PDF", updatedAt: "3 days ago", size: "3.1 MB", starred: true },
    { name: "Meeting Notes - Sprint 14", type: "MD", updatedAt: "5 days ago", size: "45 KB", starred: false },
    { name: "Vendor Contract Template", type: "DOCX", updatedAt: "1 week ago", size: "890 KB", starred: false },
]

export default function DocumentsPage() {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Documents</h1>
                    <p className="text-sm text-muted-foreground">Manage and organize your files</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input placeholder="Search documents..." className="h-9 w-64 pl-8 text-sm" />
                    </div>
                    <Button size="sm" className="h-9">
                        <Plus className="size-3.5 mr-1.5" />Upload
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                            <FileText className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">128</p>
                            <p className="text-xs text-muted-foreground">Total Documents</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <FolderOpen className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-xs text-muted-foreground">Folders</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-amber-500/10 text-amber-500">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">5</p>
                            <p className="text-xs text-muted-foreground">Recent</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Recent Documents</CardTitle>
                    <CardDescription className="text-xs">Your recently accessed files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {recentDocuments.map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-md bg-primary/10 text-primary">
                                    <FileText className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">{doc.type} • {doc.size} • {doc.updatedAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {doc.starred && <Star className="size-3.5 text-amber-400 fill-amber-400" />}
                                <Badge variant="secondary" className="text-[10px]">{doc.type}</Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
