import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSettingsProvider } from "@/contexts/theme-settings-context"
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist",
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Aurora Dashboard | Enterprise SaaS',
  description: 'Enterprise-grade dashboard with Vercel-inspired design. Clean, minimalist, and powerful.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSettingsProvider>
            {children}
          </ThemeSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
