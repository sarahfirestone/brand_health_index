"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Overview",
    href: "/dashboard",
    description: "View your brand health dashboard and analytics.",
  },
  {
    title: "Regional",
    href: "/dashboard/regional",
    description: "Analyze regional performance and competitor comparison.",
  },
  {
    title: "Engagement",
    href: "/dashboard/engagement",
    description: "Monitor stock engagement and trading metrics.",
  },
  {
    title: "Complaints",
    href: "/dashboard/complaints",
    description: "Track and analyze customer complaints.",
  },
  {
    title: "Twitter/X",
    href: "/dashboard/tweets",
    description: "Social media sentiment analysis.",
  },
  {
    title: "Advocacy",
    href: "/dashboard/advocacy",
    description: "News coverage and brand advocacy metrics.",
  },
]

export function ProvinceNavbar() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-6">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Toronto-Dominion_Bank_logo.svg.png"
              alt="TD Bank"
              width={80}
              height={30}
              className="h-8 w-auto"
            />
            <span className="hidden font-medium sm:inline-block text-[#222222]">
              Brand Health
            </span>
          </Link>
        </div>

        {/* Mobile menu button - you can add mobile menu logic here */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* You can add search functionality here if needed */}
          </div>
          <nav className="flex items-center space-x-3">
            <Link href="/documentation">
              <Button size="sm" variant="outline" className="border-[#3C8825] text-[#3C8825] hover:bg-[#3C8825]/10">
                Documentation
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-[#3C8825] hover:bg-[#3C8825]/90 text-white">
                View Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
