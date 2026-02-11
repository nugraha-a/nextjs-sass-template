"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  File,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  CornerDownLeft,
  X
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SearchCommandProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="top-[3.9%] translate-y-0 sm:max-w-4xl">
      <div className="relative">
        <CommandInput placeholder="Search" />
        <button onClick={() => setOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer">
           <X className="size-4" />
        </button>
      </div>
      <CommandList className="max-h-[500px] overflow-y-auto p-2">
        <CommandEmpty>No results found.</CommandEmpty>
        
        <div className="px-2 py-2">
             <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Advanced search</span>
        </div>
        
        <CommandGroup heading="Recent" className="text-muted-foreground">
          <CommandItem className="flex items-center gap-2 py-2 cursor-pointer" onSelect={() => setOpen(false)}>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
               <span>App</span>
               <span>/</span>
               <span className="p-0.5 bg-secondary rounded text-[10px]"><MoreHorizontal className="size-3" /></span>
               <span>/</span>
               <span className="text-primary">Create new</span>
               <CornerDownLeft className="size-3 ml-1" />
            </div>
          </CommandItem>
           <CommandItem className="flex items-center gap-2 py-2 cursor-pointer" onSelect={() => setOpen(false)}>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
               <span className="text-primary">Homepage</span>
               <span>/</span>
               <span className="text-primary">E-commerce</span>
               <CornerDownLeft className="size-3 ml-1" />
            </div>
          </CommandItem>
          <CommandItem className="flex items-center gap-2 py-2 cursor-pointer" onSelect={() => setOpen(false)}>
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
               <span className="text-primary">Pages</span>
               <span>/</span>
               <span className="text-primary">Starter</span>
               <CornerDownLeft className="size-3 ml-1" />
            </div>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator className="my-2" />
        
        <CommandGroup heading="Files">
          <CommandItem className="flex items-center gap-3 py-2 cursor-pointer" onSelect={() => setOpen(false)}>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
               <File className="size-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-medium">acme_test17.zip</span>
               <span className="text-xs text-muted-foreground">:: files / New folder / acme /</span>
            </div>
          </CommandItem>
          <CommandItem className="flex items-center gap-3 py-2 cursor-pointer" onSelect={() => setOpen(false)}>
            <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
               <ImageIcon className="size-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-medium">Product image(11).webp</span>
               <span className="text-xs text-muted-foreground">:: files / ... / assets /</span>
            </div>
          </CommandItem>
          <CommandItem className="flex items-center gap-3 py-2 cursor-pointer" onSelect={() => setOpen(false)}>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
               <FileText className="size-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-medium">How_to_not_click...pdf</span>
               <span className="text-xs text-muted-foreground">:: files / Download /</span>
            </div>
          </CommandItem>
        </CommandGroup>
        
         <CommandSeparator className="my-2" />
         
         <CommandGroup heading="Contacts">
            <div className="flex flex-wrap gap-2 px-2 py-1">
               {[
                 { name: "Jane Doe", img: "/avatars/01.jpg" },
                 { name: "John Doe", img: "/avatars/02.jpg" },
                 { name: "Adam Smith", img: "/avatars/03.jpg" },
                 { name: "Aurora", img: "/avatars/04.jpg" },
                 { name: "Alice", img: "/avatars/05.jpg" }
               ].map(contact => (
                 <div key={contact.name} className="flex items-center gap-1.5 bg-secondary/50 rounded-full pl-0.5 pr-2 py-0.5 border border-border/50 cursor-pointer hover:bg-secondary">
                    <Avatar className="size-5">
                       <AvatarImage src={contact.img} />
                       <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{contact.name}</span>
                 </div>
               ))}
                <div className="flex items-center gap-1 px-2 py-1 cursor-pointer text-primary hover:underline">
                  <span className="text-xs font-semibold">See All Contacts</span>
                  <ChevronRight className="size-3" />
                </div>
            </div>
         </CommandGroup>
         
         <CommandSeparator className="my-2" />
         
         <CommandGroup heading="Popular tags">
            <div className="flex flex-wrap gap-2 px-2 py-1">
                 {['Sales', 'Marketing', 'Development', 'Design', 'Finance'].map(tag => (
                    <Badge variant="secondary" key={tag} className="bg-secondary/50 hover:bg-secondary cursor-pointer font-normal">
                         {tag}
                    </Badge>
                 ))}
            </div>
         </CommandGroup>

      </CommandList>
    </CommandDialog>
  )
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )
}
