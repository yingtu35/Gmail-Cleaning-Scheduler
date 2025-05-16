import * as React from "react"
import { LucideIcon } from "lucide-react"
import Link from 'next/link';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/utils/cn";

export const NavSecondary = ({
  items,
  ...props
}: {
  items: {
    title: string
    href: string
    icon: LucideIcon
    rightIcon?: LucideIcon
    target?: string
    rel?: string
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) => {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href} target={item.target || '_self'} rel={item.rel || undefined}>
                <SidebarMenuButton className={cn('py-4', item.rightIcon && 'justify-between')}>
                  <div className="flex items-center gap-2">
                    <item.icon />
                    {item.title}
                  </div>
                  {item.rightIcon && <item.rightIcon />}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
