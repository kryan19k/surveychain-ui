"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LuMenu } from "react-icons/lu"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LightDarkImage } from "@/components/shared/light-dark-image"

import { ModeToggle } from "../shared/mode-toggle"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex w-full items-center justify-between sm:hidden">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <LightDarkImage
            LightImage="/SC.png"
            DarkImage="/SC.png"
            alt="SurveyChain"
            className="rounded-full"
            height={32}
            width={32}
          />
          <span className="inline-block bg-gradient-to-br from-blue-500 to-purple-700 bg-clip-text text-xl font-bold text-transparent dark:from-blue-400 dark:to-purple-500">
            {siteConfig.name}
          </span>
        </Link>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:hidden"
          >
            <LuMenu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex items-center gap-x-4">
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <LightDarkImage
              LightImage="/SC.png"
              DarkImage="/SC.png"
              alt="SurveyChain"
              height={32}
              width={32}
            />
          </MobileLink>
          <ModeToggle />
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="flex flex-col space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="surveys">
                <AccordionTrigger className="text-base font-medium">
                  Surveys
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <MobileLink href="/surveyCreation" onOpenChange={setOpen}>
                      Create Survey
                    </MobileLink>
                    <MobileLink href="/surveys" onOpenChange={setOpen}>
                      My Surveys
                    </MobileLink>
                    <MobileLink
                      href="/SurveyParticipation"
                      onOpenChange={setOpen}
                    >
                      Participate
                    </MobileLink>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="resources">
                <AccordionTrigger className="text-base font-medium">
                  Resources
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <MobileLink href="/about" onOpenChange={setOpen}>
                      About
                    </MobileLink>
                    <MobileLink href="/how-it-works" onOpenChange={setOpen}>
                      How It Works
                    </MobileLink>
                    <MobileLink href="/faq" onOpenChange={setOpen}>
                      FAQ
                    </MobileLink>
                    <MobileLink href="/get-involved" onOpenChange={setOpen}>
                      Get Involved
                    </MobileLink>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <MobileLink
              href="/dashboard"
              onOpenChange={setOpen}
              className="font-medium"
            >
              Dashboard
            </MobileLink>
            <MobileLink
              href="https://docs.surveychain.xyz"
              onOpenChange={setOpen}
              className="font-medium"
            >
              Documentation
            </MobileLink>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href)
        onOpenChange?.(false)
      }}
      className={cn(
        "block select-none space-y-1 rounded-md py-3 pl-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
    >
      {children}
    </Link>
  )
}
