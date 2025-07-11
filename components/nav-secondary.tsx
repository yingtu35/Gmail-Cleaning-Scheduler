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
  const tierDetails = user?.subscriptionDetails?.tierDetails;  
  const isBasicTier = !tierDetails || tierDetails?.name === MembershipTierName.BASIC;

  const filteredItems = items.filter((item) => !item.isBasicOnly || isBasicTier);
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {filteredItems.map((item) => (
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
