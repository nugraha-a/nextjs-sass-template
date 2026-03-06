"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Construction } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Generic placeholder for sub-routes that don't have a page yet.
 * Used by catch-all `[...slug]/page.tsx` routes to prevent 404s.
 */
export function SubRoutePlaceholder() {
    const pathname = usePathname()
    const parentPath = "/" + pathname.split("/").filter(Boolean)[0]
    const routeName = pathname
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Page"

    return (
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full border-dashed">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary mx-auto">
                        <Construction className="size-7" />
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-lg font-semibold text-foreground">{routeName}</h2>
                        <p className="text-sm text-muted-foreground">
                            This module is under development and will be available soon.
                        </p>
                    </div>
                    <code className="block text-xs text-muted-foreground/60 font-mono bg-muted/50 rounded px-3 py-1.5">
                        {pathname}
                    </code>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={parentPath}>
                            <ArrowLeft className="size-3.5 mr-1.5" />
                            Back to parent
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
