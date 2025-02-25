import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/navigation"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"

import { ourFileRouter } from "./api/uploadthing/core"
import { UserProvider } from "@/context/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InstaBlue",
  description: "An open social media network for sharing images.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto max-w-lg pb-32 pt-4 md:pt-24 md:pb-4">
                {children}
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
