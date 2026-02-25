import React from "react"
import type { Metadata } from 'next'
import { Geist_Mono, Inter, Open_Sans, Plus_Jakarta_Sans, Geist } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSettingsProvider } from "@/contexts/theme-settings-context"
import { AuthProvider } from "@/contexts/auth-context"
import './globals.css'

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: 'Nextjs SaaS Template',
  description: 'Enterprise-grade dashboard with Vercel-inspired design. Clean, minimalist, and powerful.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
  },
}

import { themeScript } from "@/lib/theme-script"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning className={`${geistMono.variable} ${inter.variable} ${openSans.variable} ${jakarta.variable} ${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSettingsProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

