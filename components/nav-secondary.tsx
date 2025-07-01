import * as React from "react"
import { LucideIcon } from "lucide-react"
import Link from 'next/link';
import { User } from "next-auth";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/utils/cn";
import { SubscriptionDetails } from "@/types/subscription";
import { MembershipTierName } from "@/types/membershipTier";
export const NavSecondary = ({
  user,
  items,
  ...props
}: {
  user: ({
    id?: string;
    subscriptionDetails?: SubscriptionDetails | null;
  } & User) | null,
  items: {
    title: string
    href: string
    icon: LucideIcon
    rightIcon?: LucideIcon
    target?: string
    rel?: string
    isBasicOnly?: boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) => {
  const { subscriptionDetails } = user || {};
  const { tierDetails } = subscriptionDetails || {};
  const isBasicTier = tierDetails?.name === MembershipTierName.BASIC;
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            if (item.isBasicOnly && !isBasicTier) return null;
            return (
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
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
