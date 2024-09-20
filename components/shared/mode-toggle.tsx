/* eslint-disable react/jsx-no-undef */
"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { FaDotCircle, FaPaintBrush, FaTree, FaWater } from "react-icons/fa"
import {
  FaCheck,
  FaCircleNodes,
  FaCode,
  FaCube,
  FaDiamond,
  FaMicrochip,
  FaNetworkWired,
} from "react-icons/fa6"
import { FiCoffee } from "react-icons/fi"
import { GiMeditation, GiVampireDracula } from "react-icons/gi"
import { LuLaptop, LuMoon, LuSun, LuSunDim } from "react-icons/lu"
import { PiSunDimThin } from "react-icons/pi"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Apply the theme to the html element
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme)
    }
  }, [theme])

  const themes = [
    { value: "light", label: "Light", icon: LuSun },
    { value: "dark", label: "Dark", icon: LuMoon },
    { value: "system", label: "System", icon: LuLaptop },
    { value: "cyberpunk", label: "Cyberpunk", icon: FaCube },
    { value: "wireframe", label: "Wireframe", icon: FaCode },
    { value: "dim", label: "Dim", icon: PiSunDimThin },
    { value: "luxury", label: "Luxury", icon: FaDiamond },
    { value: "business", label: "Business", icon: LuLaptop },
    { value: "night", label: "Night", icon: LuMoon },
    { value: "coffee", label: "Coffee", icon: FiCoffee },
    { value: "forest", label: "Forest", icon: FaTree },
    { value: "black", label: "Black", icon: FaDotCircle },
    { value: "aqua", label: "Aqua", icon: FaWater },
    { value: "lofi", label: "Lofi", icon: GiMeditation },
    { value: "pastel", label: "Pastel", icon: FaPaintBrush },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <LuSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <LuMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((t) => (
          <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center">
                {t.icon && <t.icon className="mr-2 h-4 w-4" />}
                {t.label}
              </span>
              {theme === t.value && <FaCheck className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
