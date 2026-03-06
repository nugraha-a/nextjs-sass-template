import { HelpCircle, Book, MessageCircle, ExternalLink, Search, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const sections = [
    {
        title: "Getting Started",
        icon: <Book className="size-5" />,
        items: [
            "Quick start guide",
            "Setting up your workspace",
            "Inviting team members",
            "Understanding roles & permissions",
        ],
    },
    {
        title: "Features",
        icon: <HelpCircle className="size-5" />,
        items: [
            "Dashboard overview",
            "Workflow automation",
            "Document management",
            "Reporting & analytics",
        ],
    },
    {
        title: "Support",
        icon: <MessageCircle className="size-5" />,
        items: [
            "Contact support team",
            "Submit a bug report",
            "Feature requests",
            "Community forum",
        ],
    },
]

export default function HelpPage() {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-3">
                <h1 className="text-xl font-semibold text-foreground">Help & Documentation</h1>
                <p className="text-sm text-muted-foreground">Find answers, guides, and support resources</p>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Search help articles..." className="h-10 pl-10 text-sm" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {sections.map((section) => (
                    <Card key={section.title}>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                                    {section.icon}
                                </div>
                                {section.title}
                            </CardTitle>
                            <CardDescription className="text-xs">Browse {section.title.toLowerCase()} topics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {section.items.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
                                >
                                    <span className="text-sm text-foreground">{item}</span>
                                    <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-linear-to-br from-primary/5 to-background border-primary/20">
                <CardContent className="p-6 text-center space-y-3">
                    <h3 className="text-sm font-medium text-foreground">Can&apos;t find what you&apos;re looking for?</h3>
                    <p className="text-xs text-muted-foreground">Our support team is ready to help</p>
                    <a
                        href="mailto:support@example.com"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                        Contact Support <ExternalLink className="size-3.5" />
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
